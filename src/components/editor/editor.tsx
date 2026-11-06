import { useEffect, useRef, useState } from "react";
import "./editor.css";
import { useWorkspace } from "../../context/workspace-context";

export default function Editor() {
    const { selectedFilePath, isDirty, setIsDirty, registerSaveHandler } =
        useWorkspace();

    const [content, setContent] = useState<string>("");
    const [originalContent, setOriginalContent] = useState<string>("");

    const contentRef = useRef(content);
    contentRef.current = content;

    const originalRef = useRef(originalContent);
    originalRef.current = originalContent;

    const pathRef = useRef(selectedFilePath);
    pathRef.current = selectedFilePath;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const lineCount = content.split("\n").length;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

    useEffect(() => {
        if (!selectedFilePath) {
            setContent("");
            setOriginalContent("");
            return;
        }

        let cancelled = false;

        window.electronAPI
            .readFile(selectedFilePath)
            .then((text) => {
                if (cancelled) return;
                setContent(text);
                setOriginalContent(text);
            })
            .catch((e) => {
                if (cancelled) return;
            });

        return () => {
            cancelled = true;
        };
    }, [selectedFilePath]);

    useEffect(() => {
        setIsDirty(content !== originalContent);
    }, [content, originalContent, setIsDirty]);

    useEffect(() => {
        if (!selectedFilePath) return;

        const handler = async () => {
            const path = pathRef.current;
            if (!path) return;
            const text = contentRef.current;
            if (text === originalRef.current) return;

            await window.electronAPI.writeFile(path, text);
            setOriginalContent(text);
        };

        return registerSaveHandler(handler);
    }, [selectedFilePath, registerSaveHandler]);

    if (!selectedFilePath) {
        return <div className="editor editor--empty">Файл не выбран</div>;
    }

    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    return (
        <div className="editor-window">
            <div className="bar-label">Editor</div>
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </div>
    );
}
