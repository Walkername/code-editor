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
};
