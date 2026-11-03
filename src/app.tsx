import { HashRouter, Route, Router, Routes } from "react-router-dom";
import MainPage from "./pages/main-page/main-page";
import { createRoot } from "react-dom/client";
import React from "react";
import { WorkspaceProvider } from "./context/workspace-context";

export default function App() {
    return (
        <WorkspaceProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </HashRouter>
        </WorkspaceProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
