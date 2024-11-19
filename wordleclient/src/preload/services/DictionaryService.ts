import { readFileSync } from "fs";
import { resolve } from "path";

class DictionaryService {
  public loadDictionary(filePath: string): string[] {
    const data = readFileSync(filePath, "utf-8");
    return data.split("\n").map((word) => word.trim().toLowerCase());
  }
}

const dictionaryService = new DictionaryService();
const dictionaryArray = dictionaryService.loadDictionary(
  resolve(__dirname, "../../resources/dictionary.txt")
);
export default dictionaryArray;
