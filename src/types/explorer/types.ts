export type DirEntry = {
    name: string;
    path: string;
    isDirectory: boolean;
};

export type TreeNode = DirEntry & {
    children?: TreeNode[];
    isExpanded?: boolean;
    isLoading?: boolean;
};