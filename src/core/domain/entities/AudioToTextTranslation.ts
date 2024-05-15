export class AudioToTextTranslation {
  originalLanguage: string;
  targetLanguage: string;
  filePath: string;

  constructor(
    originalLanguage: string,
    targetLanguage: string,
    filePath: string
  ) {
    this.originalLanguage = originalLanguage;
    this.targetLanguage = targetLanguage;
    this.filePath = filePath;
  }
}
