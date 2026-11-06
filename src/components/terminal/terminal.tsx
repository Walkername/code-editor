import "./terminal.css";

export default function Terminal() {
    return (
        <div className="terminal-window">
            <div className="bar-label">Terminal</div>
            <div className="terminal">
                <div className="terminal-output">
                    
                </div>
                <div className="terminal-input-container">
                    {">"}<input className="terminal-input" type="text" />
                </div>
            </div>
        </div>
    )
}