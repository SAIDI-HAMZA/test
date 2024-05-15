import { createWriteStream, existsSync, unlinkSync } from 'node:fs';

import util from 'util';
import { pipeline } from 'stream';
import { Multipart } from '@fastify/multipart';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AwsTranslationRepositoryImpl } from '../../infrastructure/repositories/AwsTranslationRepositoryImpl';
import { CreateAudioToTextTranslation } from '../../core/domain/use-cases/CreateAudioToTextTranslation';
import { CreateTextToAudioTranslation } from '../../core/domain/use-cases/CreateTextToAudioTranslation';
import { CreateStreamTranslation } from '../../core/domain/use-cases/CreateStreamTranslation';

const pump = util.promisify(pipeline);

const translationRepository = new AwsTranslationRepositoryImpl();

export const AudioTranslation = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  let originalLanguage = '';
  let targetLanguage = '';
  let filePath = '';
  let translationResult = {};
  try {
    const parts = req.parts() as AsyncIterableIterator<Multipart>;
    for await (const part of parts) {
      if (part.type === 'file') {
        const splitFilename = part.filename.split('.');
        const filename = splitFilename[0]
          .concat('-')
          .concat(Date.now().toString())
          .concat('.')
          .concat(splitFilename[1]);
        await pump(part.file, createWriteStream(filename));
        filePath = filename;
      } else {
        console.log(part);
        // part.type === 'field
        if (part.fieldname === 'originalLanguage') {
          originalLanguage = part.value as string;
        }
        if (part.fieldname === 'targetLanguage') {
          targetLanguage = part.value as string;
        }
      }
    }
    if (existsSync(filePath)) {
      const createAudioToTextTranslation = new CreateAudioToTextTranslation(
        translationRepository
      );

      const translate = await createAudioToTextTranslation.execute({
        originalLanguage,
        targetLanguage,
        filePath,
      });
      translationResult = translate;
      console.log(translationResult);
    }
  } catch (e) {
    console.log(e);
    req.server.log.error('Failed to create a audio translation ', e);
    return res.code(500).send({
      message: 'unhandled_error',
    });
  } finally {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        console.log('File is deleted.');
      } catch (err) {
        console.error(err);
      }
    }
  }
  res.code(200).send(translationResult);
};

export const TextTranslation = async (
  req: FastifyRequest<{ Body: { text: string; targetLanguage: string } }>,
  res: FastifyReply
) => {
  const { text, targetLanguage } = req.body;
  let translate;
  try {
    const createTextToAudioTranslation = new CreateTextToAudioTranslation(
      translationRepository
    );

    translate = await createTextToAudioTranslation.execute({
      text,
      targetLanguage,
    });
  } catch (e) {
    console.log(e);
    req.server.log.error('Failed to create a audio translation ', e);
    return res.code(500).send({
      message: 'unhandled_error',
    });
  }
  res.code(200).send(translate);
};

export const StreamTranslation = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  let originalLanguage = '';
  let targetLanguage = '';
  let filePath = '';
  let translationResult = {};
  try {
    const parts = req.parts() as AsyncIterableIterator<Multipart>;
    for await (const part of parts) {
      if (part.type === 'file') {
        const splitFilename = part.filename.split('.');
        const filename = splitFilename[0]
          .concat('-')
          .concat(Date.now().toString())
          .concat('.')
          .concat(splitFilename[1]);
        await pump(part.file, createWriteStream(filename));
        filePath = filename;
      } else {
        console.log(part);
        // part.type === 'field
        if (part.fieldname === 'originalLanguage') {
          originalLanguage = part.value as string;
        }
        if (part.fieldname === 'targetLanguage') {
          targetLanguage = part.value as string;
        }
      }
    }
    if (existsSync(filePath)) {
      const createStreamTranslation = new CreateStreamTranslation(
        translationRepository
      );

      const translate = await createStreamTranslation.execute({
        originalLanguage,
        targetLanguage,
        filePath,
      });
      translationResult = translate;
      console.log(translationResult);
    }
  } catch (e) {
    console.log(e);
    req.server.log.error('Failed to create a audio translation ', e);
    return res.code(500).send({
      message: 'unhandled_error',
    });
  } finally {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        console.log('File is deleted.');
      } catch (err) {
        console.error(err);
      }
    }
  }
  res.code(200).send(translationResult);
};
