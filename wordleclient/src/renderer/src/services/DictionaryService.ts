class DictionaryService {
  private dictionary: Set<string>;
  private words: string[];

  constructor(words: string[]) {
    this.dictionary = new Set(words);
    this.words = words;
  }

  public isWordValid(word: string): boolean {
    return this.dictionary.has(word.toLowerCase());
  }

  public getRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

let dictionaryService: DictionaryService | null = null;

export function initializeDictionaryService(words: string[]) {
  if (!dictionaryService) {
    dictionaryService = new DictionaryService(words);
  }
}

export function getDictionaryService(): DictionaryService {
  if (!dictionaryService) {
    throw new Error("DictionaryService not initialized");
  }
  return dictionaryService;
}
