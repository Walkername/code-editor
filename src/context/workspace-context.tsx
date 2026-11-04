import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
    useRef,
    useEffect,
} from "react";
import type { DirEntry } from "../declarations";

export type TreeNode = DirEntry & {
    children?: TreeNode[];
    isExpanded?: boolean;
    isLoading?: boolean;
};

type SaveHandler = () => Promise<void>;

type WorkspaceContextValue = {
    rootPath: string | null;
    tree: TreeNode | null;

    selectedFilePath: string | null;
    isDirty: boolean;

    openWorkspace: () => Promise<void>;
    loadChildren: (nodePath: string) => Promise<void>;
    toggleNode: (nodePath: string) => void;

    selectFile: (path: string | null) => void;
    setIsDirty: (dirty: boolean) => void;

    isSaving: boolean;
    saveActiveFile: () => Promise<void>;
    registerSaveHandler: (fn: SaveHandler) => () => void;
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

    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(
        null,
    );
    const [isDirty, setIsDirty] = useState<boolean>(false);

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

        setSelectedFilePath(null);
        setIsDirty(false);
    }, []);

    const selectFile = useCallback(
        (path: string | null) => {
            if (path === selectedFilePath) return;

            if (isDirty) {
                // todo: check 'dialog.showMessageBox' to replace with
                const ok = window.confirm(
                    "Current file has unsaved changes. Are you sure to switch?",
                );

                if (!ok) return;
            }

            setSelectedFilePath(path);
            setIsDirty(false);
        },
        [selectedFilePath, isDirty],
    );

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

    const saveHandlerRef = useRef<SaveHandler | null>(null);
    const isSavingRef = useRef(false);
    const [isSaving, setIsSaving] = useState(false);

    const registerSaveHandler = useCallback((fn: SaveHandler) => {
        saveHandlerRef.current = fn;
        return () => {
            if (saveHandlerRef.current === fn) saveHandlerRef.current = null;
        };
    }, []);

    const saveActiveFile = useCallback(async () => {
        if (!saveHandlerRef.current || isSavingRef.current) return;

        isSavingRef.current = true;
        setIsSaving(true);

        try {
            await saveHandlerRef.current();
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    }, []);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
        if (!isSave) return;
        e.preventDefault(); // блокируем «Сохранить страницу» в Electron/браузере
        saveActiveFile();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [saveActiveFile]);

    const value = useMemo(
        () => ({
            rootPath,
            tree,
            selectedFilePath,
            isDirty,
            openWorkspace,
            loadChildren,
            toggleNode,
            selectFile,
            setIsDirty,
            isSaving,
            saveActiveFile,
            registerSaveHandler,
        }),
        [
            rootPath,
            tree,
            selectedFilePath,
            isDirty,
            openWorkspace,
            loadChildren,
            toggleNode,
            selectFile,
            setIsDirty,
            isSaving,
            saveActiveFile,
            registerSaveHandler,
        ],
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
