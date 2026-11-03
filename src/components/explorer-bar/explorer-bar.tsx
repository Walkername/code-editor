import { useWorkspace } from "../../context/workspace-context";
import { FileTreeNode } from "./file-tree-node/file-tree-node";
import "./explorer-bar.css";

export default function ExplorerBar() {
    const { tree, rootPath, openWorkspace } = useWorkspace();

    return (
        <div className="explorer-window">
            <div className="explorer">
                <button onClick={openWorkspace}>Open Folder</button>

                <div className="explorer__body">
                    {!rootPath && (
                        <p className="explorer__empty">
                            Folder is not selected
                        </p>
                    )}
                    {tree && <FileTreeNode node={tree} depth={0} />}
                </div>
            </div>
        </div>
    );
}
