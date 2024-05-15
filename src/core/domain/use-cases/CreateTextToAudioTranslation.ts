import { TranslationRepository } from '../../repositories/TranslationRepository';
import { TextToAudioTranslation } from '../entities/TextToAudioTranslation';
import { TextToAudioTranslationResult } from '../entities/TextToAudioTranslationResult';

interface CreateTextToAudioTranslationInput {
  text: string;
  targetLanguage: string;
}

export class CreateTextToAudioTranslation {
  private translationRepository: TranslationRepository;
  constructor(translationRepository: TranslationRepository) {
    this.translationRepository = translationRepository;
  }
  async execute(
    input: CreateTextToAudioTranslationInput
  ): Promise<TextToAudioTranslationResult> {
    const { text, targetLanguage } = input;
    const textToAudioTranslation = new TextToAudioTranslation(
      text,
      targetLanguage
    );
    const translation = await this.translationRepository.translateText(
      textToAudioTranslation
    );
    return translation;
  }
}
