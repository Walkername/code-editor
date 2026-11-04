import { useCallback, useState } from "react";
import "./tool-bar.css";
import { DropdownType } from "../../types/tool-bar/types";
import { dropdownRegistry } from "./dropdowns";

const items: { type: DropdownType; label: string }[] = [
    { type: "file", label: "File" },
    { type: "edit", label: "Edit" },
];

export default function ToolBar() {
    const [open, setOpen] = useState<DropdownType | null>(null);
    const close = useCallback(() => setOpen(null), []);

    return (
        <div className="tool-bar">
            {items.map(({ type, label }) => {
                const Dropdown = dropdownRegistry[type];
                return (
                    <div key={type} className="tool-bar__item">
                        <button
                            data-dropdown-trigger
                            className="tool-bar__button"
                            onClick={() => {
                                console.log(open);
                                setOpen((prev) =>
                                    prev === type ? null : type,
                                );
                            }}
                        >
                            {label}
                        </button>

                        {open === type && <Dropdown close={close} />}
                    </div>
                );
            })}
        </div>
    );
}
