import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { dialog, ipcMain } from "electron/main";
import { promises as fs } from "node:fs";
import { store } from "./store/store";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        );
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let allowedRoot: string | null = null;

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

    allowedRoot = path.resolve(dir);

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

ipcMain.handle("dialog:openDirectory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Select a directory",
    });

    if (canceled || filePaths.length === 0) {
        return null;
    }

    allowedRoot = path.resolve(filePaths[0]);
    return allowedRoot;
});

ipcMain.handle("fs:readDirectory", async (_e, dirPath: string) => {
    if (!allowedRoot) throw new Error("No directory selected");
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

function assertInsideRoot(target: string): void {
    if (!allowedRoot) {
        throw new Error("No directory selected");
    }

    const resolved = path.resolve(target);
    const rel = path.relative(allowedRoot, resolved);

    if (rel === "") return;
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
        throw new Error(`Access denied: ${target} is outside of root`);
    }
}

ipcMain.handle("fs:readFile", async (_e, filePath: string) => {
    assertInsideRoot(filePath);
    return fs.readFile(filePath, "utf-8");
});

ipcMain.handle("fs:writeFile", async (_e, filePath: string, data: string) => {
    assertInsideRoot(filePath);
    await fs.writeFile(filePath, data, "utf-8");
});
