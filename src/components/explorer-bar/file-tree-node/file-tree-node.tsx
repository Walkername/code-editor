import { useEffect } from "react";
import { useWorkspace } from "../../../context/workspace-context";
import "./file-tree-node.css";
import { TreeNode } from "../../../types/explorer/types";

type Props = {
    node: TreeNode;
    depth: number;
};

export function FileTreeNode({ node, depth }: Props) {
    const { toggleNode, loadChildren, selectFile, selectedFilePath } = useWorkspace();
    const isSelected = selectedFilePath === node.path;

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

    const handleClick = () => {
        if (node.isDirectory) {
            toggleNode(node.path);
        } else {
            selectFile(node.path);
        }
    };

    const isFolder = node.isDirectory;

    const initialPaddingLeft = 6;

    return (
        <div>
            <div
                className={`file-tree-node ${isSelected && "file-tree-node-selected"}`}
                style={{ paddingLeft: initialPaddingLeft + depth * 16 }}
                onClick={handleClick}
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
