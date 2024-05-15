export class TextToAudioTranslation {
  text: string;
  targetLanguage: string;

  constructor(text: string, targetLanguage: string) {
    this.text = text;
    this.targetLanguage = targetLanguage;
  }
}
