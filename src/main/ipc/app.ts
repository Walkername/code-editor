import { ipcMain } from "electron/main";
import path from "node:path";
import { setAllowedRoot } from "../security/workspace";
import { promises as fs } from "node:fs";
import { store } from "../../store/store";

export const registerAppHandlers = () => {
    ipcMain.handle("app:getLastWorkspace", async () => {
        const dir = store.get("lastDirectory");
        if (!dir) return null;
    
        try {
            const stat = await fs.stat(dir);
            if (!stat.isDirectory()) throw new Error("Not a directory");
        } catch {
            store.set("lastDirectory", null);
            return null;
        }
    
        setAllowedRoot(path.resolve(dir));
    
        return {
            lastDirectory: dir,
            lastFile: store.get("lastFile"),
            expandedPaths: store.get("expandedPaths"),
        };
    });
    
    ipcMain.handle("app:setLastDirectory", (_e, dir: string | null) => {
        store.set("lastDirectory", dir);
    });
    
    ipcMain.handle("app:setLastFile", (_e, filePath: string | null) => {
        store.set("lastFile", filePath);
    });
}