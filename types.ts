export enum AppView {
  INGESTION = 'INGESTION',
  CHUNKING = 'CHUNKING',
  CHAT = 'CHAT',
}

export interface CleaningOptions {
  removeHtml: boolean;
  normalizeWhitespace: boolean;
  removeBoilerplate: boolean;
  removeUrls: boolean;
  removeEmails: boolean;
  removeSpecialChars: boolean;
  lowercase: boolean;
}

export interface AugmentationOptions {
  paraphrasing: boolean;
  backTranslation: boolean;
  swapEntities: boolean;
  synonyms: boolean;
}

export interface VectorConfig {
  chunkSize: number;
  chunkOverlap: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface FileData {
  name: string;
  rawContent: string;
  cleanedContent: string;
}