import { useWorkspace } from "../../context/workspace-context";
import { FileTreeNode } from "./file-tree-node/file-tree-node";
import "./explorer-bar.css";

export default function ExplorerBar() {
    const { tree, rootPath, openWorkspace } = useWorkspace();

    return (
        <div className="explorer-window">
            <div className="bar-label">Explorer</div>
            <div className="explorer">
                {!rootPath ? (
                    <div className="explorer-empty">
                        <button onClick={openWorkspace}>Open Folder</button>
                        <p>Folder is not selected</p>
                    </div>
                ) : (
                    <div className="explorer-content">
                        {tree && <FileTreeNode node={tree} depth={0} />}
                    </div>
                )}
            </div>
        </div>
    );
}
