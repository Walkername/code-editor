import { registerAppHandlers } from "./app";
import { registerDialogHandlers } from "./dialog";
import { registerFsHandlers } from "./fs";

export const registerIpcHandlers = () => {
    registerAppHandlers();
    registerDialogHandlers();
    registerFsHandlers();
}