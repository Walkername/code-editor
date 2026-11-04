import { useRef, useState } from "react";
import "./editor.css";

export default function Editor() {
    const [text, setText] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const lineCount = text.split("\n").length;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    return (
        <div className="editor">
            <div className="editor-line-numbers-container" ref={lineNumbersRef}>
                {lineNumbers.map((number) => (
                    <div className="editor-line-number" key={number}>
                        {number}
                    </div>
                ))}
            </div>
            <textarea
                className="editor-textarea"
                ref={textareaRef}
                wrap="off"
                onScroll={handleScroll}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}
