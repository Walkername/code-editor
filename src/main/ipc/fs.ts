import { ipcMain } from "electron/main";
import path from "node:path";
import { assertInsideRoot, getAllowedRoot } from "../security/workspace";
import { promises as fs } from "node:fs";

export const registerFsHandlers = () => {
    ipcMain.handle("fs:readDirectory", async (_e, dirPath: string) => {
        if (!getAllowedRoot()) throw new Error("No directory selected");
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            return entries
                .map((entry) => ({
                    name: entry.name,
                    path: path.join(dirPath, entry.name),
                    isDirectory: entry.isDirectory(),
                }))
                .sort((a, b) =>
                    a.isDirectory === b.isDirectory
                        ? a.name.localeCompare(b.name)
                        : a.isDirectory
                          ? -1
                          : 1,
                );
        } catch (err) {
            console.error("readDirectory error:", err);
            return [];
        }
    });
    
    ipcMain.handle("fs:readFile", async (_e, filePath: string) => {
        assertInsideRoot(filePath);
        return fs.readFile(filePath, "utf-8");
    });
    
    ipcMain.handle("fs:writeFile", async (_e, filePath: string, data: string) => {
        assertInsideRoot(filePath);
        await fs.writeFile(filePath, data, "utf-8");
    });
};