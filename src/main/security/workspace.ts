import path from "node:path";

let allowedRoot: string | null = null;

export const setAllowedRoot = (dir: string): string => {
    allowedRoot = path.resolve(dir);
    return allowedRoot;
};

export const getAllowedRoot = () => {
    return allowedRoot;
};

export const assertInsideRoot = (target: string): void => {
    if (!allowedRoot) {
        throw new Error("No directory selected");
    }

    const resolved = path.resolve(target);
    const rel = path.relative(allowedRoot, resolved);

    if (rel === "") return;
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
        throw new Error(`Access denied: ${target} is outside of root`);
    }
};
