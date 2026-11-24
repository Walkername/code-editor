import { dialog, ipcMain } from "electron/main";
import path from "node:path";
import { getAllowedRoot, setAllowedRoot } from "../security/workspace";

export const registerDialogHandlers = () => {
    ipcMain.handle("dialog:openDirectory", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
            title: "Select a directory",
        });

        if (canceled || filePaths.length === 0) {
            return null;
        }

        setAllowedRoot(path.resolve(filePaths[0]));
        return getAllowedRoot();
    });

    ipcMain.handle("dialog:openFile", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"],
            title: "Select a file",
        });

        if (canceled || filePaths.length === 0) {
            return null;
        }

        return path.resolve(filePaths[0]);
    });
};
