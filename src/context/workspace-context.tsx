// context/workspace-context.tsx
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
} from "react";
import type { DirEntry } from "../declarations";

export type TreeNode = DirEntry & {
    children?: TreeNode[];
    isExpanded?: boolean;
    isLoading?: boolean;
};

type WorkspaceContextValue = {
    rootPath: string | null;
    tree: TreeNode | null;
    openWorkspace: () => Promise<void>;
    loadChildren: (nodePath: string) => Promise<void>;
    toggleNode: (nodePath: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function updateNode(
    node: TreeNode,
    targetPath: string,
    updater: (n: TreeNode) => TreeNode,
): TreeNode {
    if (node.path === targetPath) return updater(node);
    if (!node.children) return node;
    return {
        ...node,
        children: node.children.map((c) => updateNode(c, targetPath, updater)),
    };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [tree, setTree] = useState<TreeNode | null>(null);

    const openWorkspace = useCallback(async () => {
        const path = await window.electronAPI.openDirectory();
        if (!path) return;

        const entries = await window.electronAPI.readDirectory(path);
        const name = path.split(/[\\/]/).pop() || path;

        setRootPath(path);
        setTree({
            name,
            path,
            isDirectory: true,
            isExpanded: true,
            children: entries.map((e) => ({ ...e, children: undefined })),
        });
    }, []);

    const loadChildren = useCallback(async (nodePath: string) => {
        const entries = await window.electronAPI.readDirectory(nodePath);
        setTree((prev) =>
            prev
                ? updateNode(prev, nodePath, (n) => ({
                      ...n,
                      children: entries.map((e) => ({
                          ...e,
                          children: undefined,
                      })),
                      isLoading: false,
                  }))
                : prev,
        );
    }, []);

    const toggleNode = useCallback((nodePath: string) => {
        setTree((prev) => {
            if (!prev) return prev;
            return updateNode(prev, nodePath, (n) => ({
                ...n,
                isExpanded: !n.isExpanded,
                isLoading:
                    !n.isExpanded && n.children === undefined
                        ? true
                        : n.isLoading,
            }));
        });
    }, []);

    const value = useMemo(
        () => ({ rootPath, tree, openWorkspace, loadChildren, toggleNode }),
        [rootPath, tree, openWorkspace, loadChildren, toggleNode],
    );

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const ctx = useContext(WorkspaceContext);
    if (!ctx)
        throw new Error("useWorkspace must be used within WorkspaceProvider");
    return ctx;
}
