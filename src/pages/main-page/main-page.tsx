import Editor from "../../components/editor/editor";
import ExplorerBar from "../../components/explorer-bar/explorer-bar";
import Terminal from "../../components/terminal/terminal";
import ToolBar from "../../components/toolbar/tool-bar";
import "./main-page.css";

export default function MainPage() {
    return (
        <div className="window">
            <ToolBar />
            <div className="main-window">
                <ExplorerBar />
                <div className="central-window">
                    <Editor />
                    <Terminal />
                </div>
            </div>
        </div>
    );
}
