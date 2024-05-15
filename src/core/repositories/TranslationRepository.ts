import { AudioToTextTranslation } from '../domain/entities/AudioToTextTranslation';
import { AudioToTextTranslationResult } from '../domain/entities/AudioToTextTranslationResult';
import { TextToAudioTranslation } from '../domain/entities/TextToAudioTranslation';
import { TextToAudioTranslationResult } from '../domain/entities/TextToAudioTranslationResult';

export interface TranslationRepository {
  translateAudio(
    audioToTextTranslation: AudioToTextTranslation
  ): Promise<AudioToTextTranslationResult>;
  translateText(
    textToAudioTranslation: TextToAudioTranslation
  ): Promise<TextToAudioTranslationResult>;
  translateStreamAudio(
    audioToTextTranslation: AudioToTextTranslation
  ): Promise<AudioToTextTranslationResult>;
}
