import { useEffect, useRef } from "react";
import { MenuItem } from "../../types/context-menu/types";
import "./context-menu.css";

type ContextMenuProps = {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
};

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) onClose();
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    const style: React.CSSProperties = {
        position: "fixed",
        top: Math.min(y, window.innerHeight - 200),
        left: Math.min(x, window.innerWidth - 220),
        zIndex: 1000,
    };

    return (
        <div ref={menuRef} className="context-menu" style={style}>
            {items.map((item, index) => (
                <li key={index}>
                    <button
                        key={item.id}
                        className={`context-menu__item ${item.danger ? "danger" : ""}`}
                        disabled={item.disabled}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                    >
                        {item.label}
                    </button>
                </li>
            ))}
        </div>
    );
}
