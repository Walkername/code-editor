import { useEffect, useRef, useState } from "react";
import { useWorkspace } from "../../../context/workspace-context";
import "./file-tree-node.css";
import { TreeNode } from "../../../types/explorer/types";
import { File, Folder, FolderOpen } from "lucide-react";

type Props = {
    node: TreeNode;
    depth: number;
};

export function FileTreeNode({ node, depth }: Props) {
    const { toggleNode, loadChildren, selectFile, selectedFilePath } =
        useWorkspace();
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

    return (
        <div className="file-tree">
            <div
                className={`file-tree-node ${isSelected && "file-tree-node-selected"}`}
                style={{ "--node-depth": `${depth}` } as React.CSSProperties}
                onClick={handleClick}
            >
                <span className="file-tree-node-icon">
                    {isFolder ? (
                        node.isExpanded ? (
                            <FolderOpen size="14" />
                        ) : (
                            <Folder size="14" />
                        )
                    ) : (
                        <File size="14" />
                    )}
                </span>
                <span className="file-tree-node-name">{node.name}</span>
                {node.isLoading && (
                    <span className="file-tree-node__spinner">…</span>
                )}
            </div>

            {isFolder && node.isExpanded && node.children && (
                <div>
                    {node.children.length === 0 && !node.isLoading && (
                        <div
                            className="file-tree-node file-tree-node--empty"
                            style={{ "--node-depth": `${depth + 1}` } as React.CSSProperties}
                        >
                            empty
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
