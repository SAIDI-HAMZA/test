import { readFileSync } from 'fs';
import path from 'path';
import { cwd } from 'process';
import {
  Hospital,
  SupportedLanguage,
  Conversation,
  ConversationLine,
  ConversationAudio,
} from '@prisma/client';
import { addDays } from '../src/utils/date';

export const supportedLanguages: Omit<SupportedLanguage, 'id'>[] = [
  { locale_short: 'fr', locale_long: 'fr-FR' },
  { locale_short: 'en', locale_long: 'en-US' },
  { locale_short: 'ar', locale_long: 'ar-AE' },
  { locale_short: 'ar', locale_long: 'ar-KW' },
  { locale_short: 'ar', locale_long: 'ar-MA  ' },
  { locale_short: 'pt', locale_long: 'pt-BR' },
  { locale_short: 'bg', locale_long: 'bg-BG' },
  { locale_short: 'ca', locale_long: 'ca-ES' },
  { locale_short: 'hr', locale_long: 'hr-HR' },
  { locale_short: 'cs', locale_long: 'cs-CZ' },
  { locale_short: 'da', locale_long: 'da-DK' },
  { locale_short: 'fi', locale_long: 'fi-FI' },
  { locale_short: 'ga', locale_long: 'ga-IE' },
  { locale_short: 'el', locale_long: 'el-GR' },
  { locale_short: 'gu', locale_long: 'gu-IN' },
  { locale_short: 'he', locale_long: 'he-IL' },
  { locale_short: 'hi', locale_long: 'hi-IN' },
  { locale_short: 'hu', locale_long: 'hu-HU' },
  { locale_short: 'id', locale_long: 'id-ID' },
  { locale_short: 'ja', locale_long: 'ja-JP' },
  { locale_short: 'lv', locale_long: 'lv-LV' },
  { locale_short: 'lt', locale_long: 'lt-LT' },
  { locale_short: 'ms', locale_long: 'ms-MY' },
  { locale_short: 'mt', locale_long: 'mt-MT' },
  { locale_short: 'mr', locale_long: 'mr-IN' },
  { locale_short: 'nb', locale_long: 'nb-NO' },
  { locale_short: 'nl', locale_long: 'nl-NL' },
  { locale_short: 'fa', locale_long: 'fa-IR' },
  { locale_short: 'fil', locale_long: 'fil-PH' },
  { locale_short: 'pl', locale_long: 'pl-PL' },
  { locale_short: 'pt', locale_long: 'pt-PT' },
  { locale_short: 'ps', locale_long: 'ps-AF' },
  { locale_short: 'ru', locale_long: 'ru-RU' },
  { locale_short: 'si-LK', locale_long: 'si-LK' },
  { locale_short: 'sk', locale_long: 'sk-SK' },
  { locale_short: 'sl', locale_long: 'sl-SI' },
  { locale_short: 'sq-AL', locale_long: 'sq-AL' },
  { locale_short: 'sw-TZ', locale_long: 'sw-TZ' },
  { locale_short: 'ko', locale_long: 'ko-KR' },
  { locale_short: 'sv', locale_long: 'sv-SE' },
  { locale_short: 'sw', locale_long: 'sw-KE' },
  { locale_short: 'ta', locale_long: 'ta-IN' },
  { locale_short: 'te', locale_long: 'te-IN' },
  { locale_short: 'th', locale_long: 'th-TH' },
  { locale_short: 'tr', locale_long: 'tr-TR' },
  { locale_short: 'uk-UA', locale_long: 'uk-UA' },
  { locale_short: 'vi', locale_long: 'vi-VN' },
  { locale_short: 'yue', locale_long: 'zh-CN' },
  { locale_short: 'af-ZA', locale_long: 'af-ZA' },
];

export const hospitals: Omit<Hospital, 'id'>[] = [
  {
    activated: true,
    name: 'Hôpital Marie-Lannelongue',
    email: 'hopital-marie-lanelongue@mail.com',
  },
  {
    activated: true,
    name: 'Hôpital Paris Saint-Joseph',
    email: 'hopital-paris-st-joseph@mail.com',
  },
  {
    activated: true,
    name: 'Centre Hospitalier V Dupouy',
    email: 'centre-hospitalier-v-dupouy@mail.com',
  },
  {
    activated: true,
    name: "Centre Hospitalier d'Arpajon",
    email: "centre-hospitalier-d'arpajon@mail.com",
  },
  {
    activated: true,
    name: 'Centre Hospitalier R Ballanger',
    email: 'centre-hospitalier-r-ballanger@mail.com',
  },
  {
    activated: true,
    name: "CHI DES PORTES DE L'OISE",
    email: "chi-des-portes-de-l'oise@mail.com",
  },
  {
    activated: true,
    name: 'CHU AVICENNES BOBIGNY',
    email: 'chu-avicennes-bobigny@mail.com',
  },
];

export const hospitalDepartments: string[] = [
  'Accueil des urgences',
  'Bloc opératoire',
  'Cardiologie et médecine vasculaire',
  'Centre de vaccination',
  'Centre Médico-Psychologique (CMP)',
  'Chirurgie ambulatoire',
  'Chirurgie orthopédique et traumatologique',
  'Chirurgie viscérale et urologique',
  'Consultation de médecine générale',
  'Consultation de psychiatrie – Unité PLUCE',
  'Maladies infectieuses et tropicales',
  'Médecine du sport',
  'Médecine Intensive Réanimation',
  'Neurologie',
  'Oncologie médicale',
  'Ophtalmologie',
  'ORL et chirurgie de la face et du cou',
  'Pharmacie – stérilisation',
  'Pneumologie',
  'Radiologie et Imagerie médicale',
  'Rééducation Fonctionnelle – Kinésithérapie – Ostéopathie – Pédicurie',
  'Rhumatologie',
  'Service de Traitement des Maladies Addictives',
  'Service diététique',
  'SSR – Soins de suite et de réadaptation',
];

export const conversations: Omit<
  Conversation,
  | 'id'
  | 'ended_at'
  | 'updated_at'
  | 'started_at'
  | 'device_id'
  | 'locale_id'
  | 'display_id'
>[] = [
  {
    accurate: true,
    review_due_date: addDays(1),
  },
  {
    accurate: false,
    review_due_date: addDays(3),
  },
  {
    accurate: true,
    review_due_date: addDays(2),
  },
];

const lineAddedAt = new Date();
export const conversationLines: Omit<
  ConversationLine,
  'id' | 'conversation_id' | 'locale_id' | 'conversation_audio_id'
>[] = [
  {
    original_text: "Hello, I'm Louis",
    translated_text: 'Bonjour je suis Louis',
    speaker: 'PATIENT',
    added_at: lineAddedAt,
  },
  {
    original_text: 'Bonjour, que puis-je faire pour vous?',
    translated_text: 'Hi, what can I do for you',
    speaker: 'MEDICAL_TEAM',
    added_at: new Date(lineAddedAt.getTime() + 60000),
  },
  {
    original_text: 'I have back pain',
    translated_text: "J'ai mal au dos",
    speaker: 'PATIENT',
    added_at: new Date(lineAddedAt.getTime() + 2 * 60000),
  },
  {
    original_text: 'Bonjour, je suis le docteur grey',
    translated_text: "Good morning, I'm doctor grey",
    speaker: 'MEDICAL_TEAM',
    added_at: new Date(lineAddedAt.getTime() + 3 * 60000),
  },
  {
    original_text: "Hi, I'm Joe, I need medicine to cure my cold",
    translated_text: "Salut, j'ai besoin de médicaments pour guérir mon rhume",
    speaker: 'PATIENT',
    added_at: new Date(lineAddedAt.getTime() + 4 * 60000),
  },
  {
    original_text: 'Très bien, je vais vous faire une ordonnance',
    translated_text: "Very good, i'll give you a prescription",
    speaker: 'MEDICAL_TEAM',
    added_at: new Date(lineAddedAt.getTime() + 5 * 60000),
  },
  {
    original_text:
      "Bienvenue à l'hôpital Saint Joseph, comment puis-je vous aider ?",
    translated_text: 'Welcome to St Joseph hospital, how can I help you',
    speaker: 'MEDICAL_TEAM',
    added_at: new Date(lineAddedAt.getTime() + 6 * 60000),
  },
  {
    original_text: "Hi, I'm Joe, I need medicine to cure my cold",
    translated_text: "Salut, j'ai besoin de médicaments pour guérir mon rhume",
    speaker: 'PATIENT',
    added_at: new Date(lineAddedAt.getTime() + 7 * 60000),
  },
  {
    original_text: 'Très bien, je vais vous faire une ordonnance',
    translated_text: "Very good, i'll give you a prescription",
    speaker: 'MEDICAL_TEAM',
    added_at: new Date(lineAddedAt.getTime() + 8 * 60000),
  },
];

export const audios: Omit<ConversationAudio, 'id'>[] = [
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_01.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_02.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_03.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_04.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_05.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_06.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_07.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_08.mp3'),
      { encoding: 'base64' }
    ),
  },
  {
    audio_path: readFileSync(
      path.join(cwd() + '/fixtures/audio/sample_09.mp3'),
      { encoding: 'base64' }
    ),
  },
];
