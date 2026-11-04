// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

type DirEntry = {
    name: string;
    path: string;
    isDirectory: boolean;
};

contextBridge.exposeInMainWorld("electronAPI", {
    openDirectory: (): Promise<string | null> =>
        ipcRenderer.invoke("dialog:openDirectory"),
    readDirectory: (dirPath: string): Promise<DirEntry[]> =>
        ipcRenderer.invoke("fs:readDirectory", dirPath),
    readFile: (p: string) => ipcRenderer.invoke("fs:readFile", p),
    writeFile: (p: string, data: string) =>
        ipcRenderer.invoke("fs:writeFile", p, data),
});
