export interface TextStats {
  charCount: number;
  charCountNoSpaces: number;
  wordCount: number;
  lineCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordLength: number;
  // Future additions could include:
  // readingTimeMinutes: number;
  // commonWords: Array<{ word: string; count: number }>;
} 