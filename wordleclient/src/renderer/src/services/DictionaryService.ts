class DictionaryService {
  private dictionary: Set<string>;

  constructor(words: string[]) {
    this.dictionary = new Set(words);
  }

  public isWordValid(word: string): boolean {
    return this.dictionary.has(word.toLowerCase());
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
