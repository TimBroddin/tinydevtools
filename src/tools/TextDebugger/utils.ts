import { type TextStats } from "@/tools/TextDebugger/types";

export function calculateTextStats(text: string): TextStats {
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;

  const lines = text.split(/\r\n|\r|\n/);
  const lineCount = text ? lines.length : 0; // count as 0 if text is empty, otherwise 1 for even a single line without newline char

  const sentences = text.split(/[.!?]+/g).filter(Boolean);
  const sentenceCount = sentences.length;

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== "");
  const paragraphCount = paragraphs.length;

  const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
  const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

  return {
    charCount,
    charCountNoSpaces,
    wordCount,
    lineCount,
    sentenceCount,
    paragraphCount,
    averageWordLength: parseFloat(averageWordLength.toFixed(2)),
  };
} 