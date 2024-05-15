export class TextToAudioTranslationResult {
  targetLanguage: string;
  originalText: string;
  file: string;

  constructor(targetLanguage: string, originalText: string, file: string) {
    this.targetLanguage = targetLanguage;
    this.originalText = originalText;
    this.file = file;
  }
}
