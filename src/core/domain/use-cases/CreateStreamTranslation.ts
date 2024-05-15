import { TranslationRepository } from '../../repositories/TranslationRepository';
import { AudioToTextTranslation } from '../entities/AudioToTextTranslation';
import { AudioToTextTranslationResult } from '../entities/AudioToTextTranslationResult';

interface CreateAudioToTextTranslationInput {
  originalLanguage: string;
  targetLanguage: string;
  filePath: string;
}

export class CreateStreamTranslation {
  private translationRepository: TranslationRepository;
  constructor(translationRepository: TranslationRepository) {
    this.translationRepository = translationRepository;
  }
  async execute(
    input: CreateAudioToTextTranslationInput
  ): Promise<AudioToTextTranslationResult> {
    const { originalLanguage, targetLanguage, filePath } = input;
    const audioToTextTranslation = new AudioToTextTranslation(
      originalLanguage,
      targetLanguage,
      filePath
    );
    const translation = await this.translationRepository.translateStreamAudio(
      audioToTextTranslation
    );
    console.log(' use-case ' + translation);
    return translation;
  }
}
