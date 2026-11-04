import Store from "electron-store";
import { Schema } from "../types/store/types";

export const store = new Store<Schema>({
    defaults: {
        lastDirectory: null,
        lastFile: null,
        expandedPaths: [],
    },
});
