/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module "*.css";

interface Window {
    readonly electronAPI: import("./types/electron-api/types").ElectronAPI;
}
