import { ComponentType } from "react";
import { DropdownType } from "../../../types/toolbar/types";
import FileDropDown from "./file/file-dropdown";
import EditDropDown from "./edit/edit-dropdown";

export type DropdownComponent = ComponentType<{ close: () => void }>;

export const dropdownRegistry: Record<DropdownType, DropdownComponent> = {
    file: FileDropDown,
    edit: EditDropDown,
};
