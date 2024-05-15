import { createReadStream } from 'node:fs';
import path from 'node:path';
import * as _stream from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import {
  CreateBucketCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadBucketCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import {
  DeleteTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  LanguageCode,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from '@aws-sdk/client-transcribe';
import {
  TranslateClient,
  TranslateTextCommand,
  TranslateTextCommandOutput,
} from '@aws-sdk/client-translate';
import {
  StartSpeechSynthesisTaskCommand,
  PollyClient,
  OutputFormat,
  TextType,
  VoiceId,
  DescribeVoicesCommand,
  Engine,
  GetSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandOutput,
  GetSpeechSynthesisTaskCommandOutput,
} from '@aws-sdk/client-polly';
import { fromInstanceMetadata } from '@aws-sdk/credential-providers';
import {
  ConflictException,
  InternalFailureException,
  MediaEncoding,
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from '@aws-sdk/client-transcribe-streaming';
import { TranslationRepository } from '../../core/repositories/TranslationRepository';
import { AudioToTextTranslation } from '../../core/domain/entities/AudioToTextTranslation';
import { AudioToTextTranslationResult } from '../../core/domain/entities/AudioToTextTranslationResult';
import { TextToAudioTranslation } from '../../core/domain/entities/TextToAudioTranslation';
import { TextToAudioTranslationResult } from '../../core/domain/entities/TextToAudioTranslationResult';

export class AwsTranslationRepositoryImpl implements TranslationRepository {
  async translateText(
    textToAudioTranslation: TextToAudioTranslation
  ): Promise<TextToAudioTranslationResult> {
    const bucketRegion = process.env.AWS_BUCKET_REGION as string;
    const bucketName = process.env.AWS_BUCKET_TEMP as string;

    const tmpCredentialsFromInstance = fromInstanceMetadata();

    const config = {
      region: bucketRegion,
      credentials: tmpCredentialsFromInstance,
    };
    const s3Client = new S3Client(config);
    const pollyClient = new PollyClient(config);
    try {
      const describeVoicesInput = {
        // DescribeVoicesInput
        Engine: Engine.STANDARD,
        LanguageCode: textToAudioTranslation.targetLanguage as any,
        IncludeAdditionalLanguageCodes: false,
      };
      const describeVoicesCommand = new DescribeVoicesCommand(
        describeVoicesInput
      );
      const response = await pollyClient.send(describeVoicesCommand);
      const voiceID = response!.Voices![0].Id;
      const params = {
        OutputFormat: OutputFormat.MP3,
        OutputS3BucketName: bucketName,
        Text: textToAudioTranslation.text,
        TextType: TextType.TEXT,
        VoiceId: voiceID as VoiceId,
        SampleRate: '22050',
      };
      const command = new StartSpeechSynthesisTaskCommand(params);
      const startSpeechSynthesisTaskResponse: StartSpeechSynthesisTaskCommandOutput =
        await pollyClient.send(command);
      const responseDetail: GetSpeechSynthesisTaskCommandOutput =
        (await waitSpeechSynthesisResponse(
          pollyClient,
          startSpeechSynthesisTaskResponse
        )) as GetSpeechSynthesisTaskCommandOutput;
      const key = responseDetail.SynthesisTask?.OutputUri?.split('/').pop();
      const s3Object: GetObjectCommandOutput = await findExecutedTask(
        s3Client,
        bucketName,
        key
      );
      const blob = await s3Object.Body?.transformToString('base64');
      return new TextToAudioTranslationResult(
        textToAudioTranslation.targetLanguage,
        textToAudioTranslation.text,
        blob!
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async translateAudio(
    audioToTextTranslation: AudioToTextTranslation
  ): Promise<AudioToTextTranslationResult> {
    const bucketRegion = process.env.AWS_BUCKET_REGION as string;
    const bucketName = process.env.AWS_BUCKET_TEMP as string;
    try {
      const tmpCredentialsFromInstance = fromInstanceMetadata();
      const config = {
        region: bucketRegion,
        credentials: tmpCredentialsFromInstance,
      };
      const s3Client = new S3Client(config);
      const transcribeClient = new TranscribeClient(config);
      const translateClient = new TranslateClient(config);
      await createBucketIfNotExist(s3Client, bucketName);
      const filename = path.basename(audioToTextTranslation.filePath);
      await pushFileIntoBucket(
        s3Client,
        audioToTextTranslation.filePath,
        bucketName
      );
      const transcriptionJobName: string =
        'Job-HospeechTranscription-' + filename;
      const fileResultName = await executeTranscription(
        transcribeClient,
        bucketName,
        transcriptionJobName,
        filename,
        audioToTextTranslation.originalLanguage
      );
      const responseGetObj: GetObjectCommandOutput = await findExecutedTask(
        s3Client,
        bucketName,
        fileResultName
      );
      const bodyString = await responseGetObj.Body!.transformToString();
      const obj = JSON.parse(bodyString);
      const originalText = obj.results.transcripts[0].transcript;
      const translatedText = (await transcriptText(
        translateClient,
        originalText,
        audioToTextTranslation.originalLanguage,
        audioToTextTranslation.targetLanguage
      )) as string;
      await deleteTranscriptionJob(transcribeClient, transcriptionJobName);
      return new AudioToTextTranslationResult(
        audioToTextTranslation.originalLanguage,
        audioToTextTranslation.targetLanguage,
        originalText,
        translatedText
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async translateStreamAudio(
    audioToTextTranslation: AudioToTextTranslation
  ): Promise<AudioToTextTranslationResult> {
    const bucketRegion = process.env.AWS_BUCKET_REGION as string;
    let originalText = '';
    let translatedText = '';
    let response;

    try {
      // const tmpCredentialsFromInstance = fromInstanceMetadata();

      const config = {
        region: bucketRegion,
        credentials: fromInstanceMetadata({
          timeout: 1000,
          maxRetries: 3,
        }),
      };

      const transcribeStreamingClient = new TranscribeStreamingClient(config);
      const audioSource = createReadStream(
        path.basename(audioToTextTranslation.filePath),
        { highWaterMark: 1024 }
      );
      const audioStream = async function* () {
        for await (const payloadChunk of audioSource) {
          yield { AudioEvent: { AudioChunk: payloadChunk } };
        }
      };
      const sourceLanguage: string = audioToTextTranslation.originalLanguage!;
      const paramsTranslate = {
        MediaEncoding: MediaEncoding.PCM,
        MediaSampleRateHertz: 16000,
        AudioStream: audioStream(),
        LanguageCode: sourceLanguage as any,
      };
      const command = new StartStreamTranscriptionCommand(paramsTranslate);
      response = await transcribeStreamingClient.send(command);

      for await (const event of response.TranscriptResultStream!) {
        if (event.TranscriptEvent) {
          const results = event.TranscriptEvent.Transcript!.Results;
          results!.map(result => {
            (result.Alternatives || []).map(alternative => {
              originalText = alternative
                .Items!.map(item => item.Content)
                .join(' ');
            });
          });
        }
      }

      if (originalText.length > 0) {
        const translateClient = new TranslateClient(config);
        translatedText = (await transcriptText(
          translateClient,
          originalText,
          audioToTextTranslation.originalLanguage,
          audioToTextTranslation.targetLanguage
        )) as string;
      }

      if (!audioSource.closed) {
        audioSource.close();
        transcribeStreamingClient.destroy();
      }
    } catch (e) {
      if (e instanceof InternalFailureException) {
        console.log(e);
        throw e;
      } else if (e instanceof ConflictException) {
        console.log(e);
        throw e;
      } else {
        console.log(e);
        throw e;
      }
    }

    return new AudioToTextTranslationResult(
      audioToTextTranslation.originalLanguage,
      audioToTextTranslation.targetLanguage,
      originalText,
      translatedText
    );
  }
}
const transcriptText = async (
  translateClient: TranslateClient,
  originalTest: string,
  originalLanguage: string,
  targetLanguage: string
) => {
  // traduction
  const paramsTranslate = {
    TargetLanguageCode: targetLanguage as LanguageCode,
    Text: originalTest,
    SourceLanguageCode: originalLanguage as LanguageCode,
  };
  const translateCommand = new TranslateTextCommand(paramsTranslate);
  const translateResponse: TranslateTextCommandOutput =
    await translateClient.send(translateCommand);
  return translateResponse.TranslatedText;
};

const deleteTranscriptionJob = async (
  transcribeClient: TranscribeClient,
  transcriptionJobName: string
) => {
  const params = {
    TranscriptionJobName: transcriptionJobName,
  };
  await transcribeClient.send(new DeleteTranscriptionJobCommand(params));
};

const findExecutedTask = async (
  s3Client: S3Client,
  bucketName: string,
  fileResultName: any
) => {
  const params = { Bucket: bucketName, Key: fileResultName };
  return await s3Client.send(new GetObjectCommand(params));
};

/*
const findSynthesisExecutedTask = async (s3Client: S3Client, bucketName: string, outputTask: GetSpeechSynthesisTaskCommandOutput) => {
     const params = { Bucket: bucketName, Key: outputTask.SynthesisTask?.OutputUri?.split("/").pop() };
    return await s3Client.send(new GetObjectCommand(params));
 
}
*/
const executeTranscription = async (
  transcribeClient: TranscribeClient,
  bucketName: string,
  transcriptionJobName: string,
  filename: string,
  originalLanguage: string
) => {
  const inputStartTranscriptionJob = {
    // StartTranscriptionJobRequest
    TranscriptionJobName: transcriptionJobName, // required
    LanguageCode: originalLanguage as LanguageCode,
    Media: {
      // Media
      MediaFileUri: 's3://' + bucketName + '/' + filename,
    },
    OutputBucketName: bucketName,
  };
  const command = new StartTranscriptionJobCommand(inputStartTranscriptionJob);
  await transcribeClient.send(command);
  // attente de la conversion
  const inputTranscribeJob = {
    // GetTranscriptionJobRequest
    TranscriptionJobName: transcriptionJobName, // required
  };
  const commandJob = new GetTranscriptionJobCommand(inputTranscribeJob);
  await transcribeClient.send(commandJob);
  const transcriptionResponse: any = await waitTranscriptionResponse(
    transcribeClient,
    inputStartTranscriptionJob
  );
  let filenameResult = '';
  if (transcriptionResponse['$metadata'].httpStatusCode === 200) {
    const fileResult =
      transcriptionResponse.TranscriptionJob.Transcript.TranscriptFileUri;
    const pathStrSplit = fileResult!.split('/');
    filenameResult = pathStrSplit.pop();
  }
  return filenameResult;
};

const pushFileIntoBucket = async (
  s3Client: S3Client,
  filePath: string,
  bucketName: string
) => {
  // push du fichier
  try {
    const filename = path.basename(filePath);
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: filename,
        Body: createReadStream(filePath),
      },

      tags: [
        /*...*/
      ], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    parallelUploads3.on('httpUploadProgress', progress => {
      console.log(progress);
    });

    await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }
};

const createBucketIfNotExist = async (
  s3Client: S3Client,
  bucketName: string
) => {
  try {
    const input = { Bucket: bucketName };
    const command = new HeadBucketCommand(input);
    await s3Client.send(command);
    return Promise.resolve();
  } catch (err: unknown) {
    if (!(err instanceof S3ServiceException)) {
      throw err;
    } else {
      console.log(err.$response!.statusCode);
      if (err.$response!.statusCode === 403) {
        console.log(`Bucket "${bucketName}" Access Denied`);
        console.log(err);
        throw err;
      }

      if (err.$response!.statusCode === 404) {
        try {
          const input = {
            Bucket: bucketName,
          };
          const command = new CreateBucketCommand(input);
          return await s3Client.send(command);
        } catch (error) {
          console.log(`Bucket "${bucketName}" Not Created`);
          throw error;
        }
      }

      if (err.$response!.statusCode >= 400 && err.$response!.statusCode < 500) {
        console.log(err);
        console.log(`Bucket "${bucketName}" Not Found`);
        throw err;
      }
    }
  }
};

const waitTranscriptionResponse = async (
  transcribeClient: TranscribeClient,
  params: any
) => {
  try {
    const data = await transcribeClient.send(
      new GetTranscriptionJobCommand(params)
    );
    const status = data.TranscriptionJob!.TranscriptionJobStatus;
    if (status === 'COMPLETED') {
      console.log('URL:', data.TranscriptionJob!.Transcript!.TranscriptFileUri);
      return data;
    } else if (status === 'FAILED') {
      console.log('Failed:', data.TranscriptionJob!.FailureReason);
      return data;
    } else {
      console.log('In Progress...');

      return new Promise(resolve => {
        setTimeout(
          () => resolve(waitTranscriptionResponse(transcribeClient, params)),
          5000
        );
      });
    }
  } catch (err) {
    console.log('Error', err);
  }
};

const waitSpeechSynthesisResponse = async (
  pollyClient: PollyClient,
  outputCommand: StartSpeechSynthesisTaskCommandOutput
) => {
  try {
    const input = {
      TaskId: outputCommand.SynthesisTask?.TaskId,
    };
    const data = await pollyClient.send(
      new GetSpeechSynthesisTaskCommand(input)
    );
    console.log('data : ' + data.SynthesisTask!.TaskStatus);
    const status = data.SynthesisTask!.TaskStatus as string;
    if (status.toUpperCase() === 'COMPLETED') {
      console.log('URL:', data.SynthesisTask!.OutputUri);
      return data;
    } else if (status.toUpperCase() === 'FAILED') {
      console.log('Failed:', data.SynthesisTask!.TaskStatusReason);
      return data;
    } else {
      console.log('In Progress...');

      return new Promise(resolve => {
        setTimeout(
          () =>
            resolve(waitSpeechSynthesisResponse(pollyClient, outputCommand)),
          5000
        );
      });
    }
  } catch (err) {
    console.log('Error', err);
  }
};
