export type MenuItem = {
    id: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
};

export type MenuState<T> = {
    open: boolean;
    x: number;
    y: number;
    target: T | null;
} | null;