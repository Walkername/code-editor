import { useCallback, useState } from "react";
import { MenuState } from "../types/context-menu/types";

export function useContextMenu<T>() {
    const [menu, setMenu] = useState<MenuState<T>>(null);

    const openMenu = useCallback((e: React.MouseEvent, target: T) => {
        e.preventDefault();
        e.stopPropagation();
        setMenu({ open: true, x: e.clientX, y: e.clientY, target });
    }, []);

    const closeMenu = useCallback(() => setMenu(null), []);

    return { menu, openMenu, closeMenu };
}
