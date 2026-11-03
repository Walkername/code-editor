/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

export type DirEntry = {
    name: string;
    path: string;
    isDirectory: boolean;
};

declare global {
    declare module "*.css";
    
    interface Window {
        electronAPI: {
            openDirectory: () => Promise<string | null>;
            readDirectory: (dirPath: string) => Promise<DirEntry[]>;
        };
    }
}
