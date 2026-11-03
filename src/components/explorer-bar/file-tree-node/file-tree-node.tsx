// components/explorer/file-tree-node.tsx
import { useEffect } from "react";
import { useWorkspace, TreeNode } from "../../../context/workspace-context";

type Props = {
    node: TreeNode;
    depth: number;
};

export function FileTreeNode({ node, depth }: Props) {
    const { toggleNode, loadChildren } = useWorkspace();

    // Ленивая загрузка: раскрыли и детей ещё нет — грузим
    useEffect(() => {
        if (
            node.isDirectory &&
            node.isExpanded &&
            node.children === undefined
        ) {
            loadChildren(node.path);
        }
    }, [
        node.isDirectory,
        node.isExpanded,
        node.children,
        node.path,
        loadChildren,
    ]);

    const isFolder = node.isDirectory;

    return (
        <div>
            <div
                className="file-tree-node"
                style={{ paddingLeft: depth * 16 }}
                onClick={() => isFolder && toggleNode(node.path)}
            >
                <span className="file-tree-node__icon">
                    {isFolder ? (node.isExpanded ? "📂" : "📁") : "📄"}
                </span>
                <span className="file-tree-node__name">{node.name}</span>
                {node.isLoading && (
                    <span className="file-tree-node__spinner">…</span>
                )}
            </div>

            {isFolder && node.isExpanded && node.children && (
                <div>
                    {node.children.length === 0 && !node.isLoading && (
                        <div
                            className="file-tree-node file-tree-node--empty"
                            style={{ paddingLeft: (depth + 1) * 16 }}
                        >
                            пусто
                        </div>
                    )}
                    {node.children.map((child) => (
                        <FileTreeNode
                            key={child.path}
                            node={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
