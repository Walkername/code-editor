import { DirEntry } from "../explorer/types";
import { Schema } from "../store/types";

export interface ElectronAPI {
    openDirectory: () => Promise<string | null>;
    readDirectory: (dirPath: string) => Promise<DirEntry[]>;
    readFile: (filePath: string) => Promise<string>;
    writeFile: (filePath: string, data: string) => Promise<void>;

    getLastWorkspace: () => Promise<Schema | null>;
    setLastDirectory: (dirPath: string | null) => Promise<void>;
    setLastFile: (filePath: string | null) => Promise<void>;
}