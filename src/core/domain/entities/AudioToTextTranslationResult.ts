export class AudioToTextTranslationResult {
  originalLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;

  constructor(
    originalLanguage: string,
    targetLanguage: string,
    originalText: string,
    translatedText: string
  ) {
    this.originalLanguage = originalLanguage;
    this.targetLanguage = targetLanguage;
    this.originalText = originalText;
    this.translatedText = translatedText;
  }
}
