import { ReactNode, useEffect, useRef, useState } from "react";
import "./dropdown.css";

type Props = {
    close: () => void;
    children: ReactNode;
};

export default function ToolDropdown({ close, children }: Props) {
    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const target = e.target as Element | null;

            if (ref.current?.contains(target as Node)) return;

            if (target?.closest?.("[data-dropdown-trigger]")) return;

            close();
        };

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onEsc);
        };
    }, [close]);

    return (
        <ul ref={ref} className="tool-dropdown">
            {children}
        </ul>
    );
}
