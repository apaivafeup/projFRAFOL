import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AnalyzerView } from "./pages/Analyzer/Analyzer.view.tsx";
import { AppProvider } from "./context/index.tsx";
import NavbarView from "./components/Navbar/Navbar.view.tsx";
import { KillMatrix } from "./pages/KillMatrix/index.tsx";
import TeacherView from "./pages/TeacherView/TeacherView.index.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <div className="flex flex-row w-full">
          <NavbarView />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/analyzer" element={<AnalyzerView />} />
            <Route path="/kill-matrix" element={<KillMatrix />} />
            <Route path="/teacher" element={<TeacherView />} />
          </Routes>
        </div>
      </StrictMode>
    </BrowserRouter>
  </AppProvider>,
);
