import { useEffect, useState } from "react";
import { useWorkspace } from "../../../context/workspace-context";
import "./file-tree-node.css";
import { TreeNode } from "../../../types/explorer/types";
import { File, Folder, FolderOpen } from "lucide-react";
import { useContextMenu } from "../../../context/context-provider";
import { MenuItem } from "../../../types/context-menu/types";
import { ContextMenu } from "../../context-menu/context-menu";

function getTargetFolderPath(node: TreeNode): string {
    if (node.isDirectory) return node.path;
    return node.path.slice(0, node.path.lastIndexOf("/"));
}

type NewFileState = {
    parentPath: string;
} | null;

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

    const { menu, openMenu, closeMenu } = useContextMenu<TreeNode>();

    const buildItems = (item: TreeNode): MenuItem[] => [
        {
            id: "new file",
            label: "New file",
            onClick: () => {
                handleNewFile(item);
            },
        },
        { id: "open", label: "Open", onClick: () => console.log(item) },
        {
            id: "rename",
            label: "Rename",
            onClick: () => console.log(item),
        },
        {
            id: "delete",
            label: "Delete",
            danger: true,
            onClick: () => console.log(item),
        },
    ];

    const [newFile, setNewFile] = useState<NewFileState>(null);
    const [newFileName, setNewFileName] = useState("");

    const handleNewFile = (item: TreeNode) => {
        const parentPath = getTargetFolderPath(item);

        if (item.isDirectory && !item.isExpanded) {
            toggleNode(item.path);
        }

        setNewFileName("");
        setNewFile({ parentPath });
    };

    const shouldShowInput =
        newFile !== null && newFile.parentPath === node.path;

    return (
        <div className="file-tree">
            <div
                className={`file-tree-node ${isSelected && "file-tree-node-selected"}`}
                style={{ "--node-depth": `${depth}` } as React.CSSProperties}
                onClick={handleClick}
                onContextMenu={(e) => openMenu(e, node)}
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
                    {shouldShowInput && (
                        <div
                            className="file-tree-node"
                            style={
                                {
                                    "--node-depth": `${depth + 1}`,
                                } as React.CSSProperties
                            }
                        >
                            <span className="file-tree-node-icon">
                                <File size="14" />
                            </span>
                            <input
                                type="text"
                                value={newFileName}
                                autoFocus
                                onChange={(e) => setNewFileName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        // TODO: создать файл newFileName в node.path
                                        console.log(
                                            "create",
                                            node.path + "\\" + newFileName,
                                        );
                                        window.electronAPI
                                            .createFile(
                                                node.path + "\\" + newFileName,
                                            )
                                            .then((path) => {
                                                selectFile(path);
                                                loadChildren(node.path);
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                            });
                                        setNewFile(null);
                                    } else if (e.key === "Escape") {
                                        setNewFile(null);
                                    }
                                }}
                                onBlur={() => setNewFile(null)}
                            />
                        </div>
                    )}

                    {node.children.length === 0 && !node.isLoading && (
                        <div
                            className="file-tree-node file-tree-node--empty"
                            style={
                                {
                                    "--node-depth": `${depth + 1}`,
                                } as React.CSSProperties
                            }
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

            {menu?.open && menu.target && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    items={buildItems(menu.target)}
                    onClose={closeMenu}
                />
            )}
        </div>
    );
}
