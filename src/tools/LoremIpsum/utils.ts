export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export interface LoremIpsumOptions {
  units: LoremUnit;
  count: number;
  startsWithLoremIpsum?: boolean;
}

const LOREM_IPSUM_TEXT = 
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const WORDS = LOREM_IPSUM_TEXT.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
const SENTENCES = LOREM_IPSUM_TEXT.split(/[.!?]+\s+/).filter(Boolean).map(s => s.trim() + '.');
const PARAGRAPHS = LOREM_IPSUM_TEXT.split(/\n\s*\n/).filter(Boolean);

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWords(count: number, startsWithLorem: boolean): string {
  const result = [];
  if (startsWithLorem && count > 0) {
    const initialWords = "Lorem ipsum dolor sit amet".split(' ');
    result.push(...initialWords.slice(0, count));
  }
  while (result.length < count) {
    result.push(getRandomElement(WORDS));
  }
  return result.slice(0, count).join(' ');
}

function generateSentences(count: number, startsWithLorem: boolean): string {
  const result = [];
  if (startsWithLorem && count > 0) {
    result.push(SENTENCES[0]);
  }
  while (result.length < count) {
    result.push(getRandomElement(SENTENCES));
  }
  return result.slice(0, count).join(' ');
}

function generateParagraphs(count: number, startsWithLorem: boolean): string {
  const result = [];
  if (startsWithLorem && count > 0) {
    result.push(PARAGRAPHS[0] || LOREM_IPSUM_TEXT.split('\n\n')[0] || SENTENCES.slice(0,3).join(' ') ); // Fallback for single paragraph
  }
  while (result.length < count) {
    // Create paragraphs from a few sentences to make them look more natural
    const numSentences = Math.floor(Math.random() * 3) + 3; // 3-5 sentences per paragraph
    const paragraphSentences = [];
    for (let i = 0; i < numSentences; i++) {
        paragraphSentences.push(getRandomElement(SENTENCES));
    }
    result.push(paragraphSentences.join(' '));
  }
  return result.slice(0, count).join('\n\n');
}

export function generateLoremIpsum(options: LoremIpsumOptions): string {
  const { units, count, startsWithLoremIpsum = true } = options;

  if (count <= 0) return '';

  switch (units) {
    case 'words':
      return generateWords(count, startsWithLoremIpsum);
    case 'sentences':
      return generateSentences(count, startsWithLoremIpsum);
    case 'paragraphs':
    default:
      return generateParagraphs(count, startsWithLoremIpsum);
  }
} 