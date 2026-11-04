// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { DirEntry } from "./types/explorer/types";
import { Schema } from "./types/store/types";

contextBridge.exposeInMainWorld("electronAPI", {
    openDirectory: (): Promise<string | null> =>
        ipcRenderer.invoke("dialog:openDirectory"),
    readDirectory: (dirPath: string): Promise<DirEntry[]> =>
        ipcRenderer.invoke("fs:readDirectory", dirPath),
    readFile: (filePath: string) => ipcRenderer.invoke("fs:readFile", filePath),
    writeFile: (filePath: string, data: string) =>
        ipcRenderer.invoke("fs:writeFile", filePath, data),

    getLastWorkspace: (): Promise<Schema | null> =>
        ipcRenderer.invoke("app:getLastWorkspace"),
    setLastDirectory: (dirPath: string | null): Promise<void> =>
        ipcRenderer.invoke("app:setLastDirectory", dirPath),
    setLastFile: (filePath: string | null): Promise<void> =>
        ipcRenderer.invoke("app:setLastFile", filePath),
});
