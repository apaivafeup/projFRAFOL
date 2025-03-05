import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppProvider } from "./context/index.tsx";
import { KillMatrix } from "./pages/KillMatrix/index.tsx";
import TeacherView from "./pages/TeacherView/TeacherView.index.tsx";
import Teacher from "./pages/TeacherView/Teacher.index.tsx";
import Submission from "./pages/StudentView/Submission/index.tsx";
import Navbar from "@components/Navbar/index.tsx";
import Analyzer from "@pages/Analyzer";
import Student from "@pages/StudentView";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <div className="flex flex-row w-full h-full">
          <div className="w-1/10">
            <Navbar />
          </div>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/select-project" element={<App />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/kill-matrix" element={<KillMatrix />} />
            <Route path="/teacher" element={<TeacherView />} />
            <Route path="/teacher/dashboard" element={<Teacher />} />
            <Route path="/student" element={<Student />} />
            <Route path="/student/submission" element={<Submission />} />
          </Routes>
        </div>
      </StrictMode>
    </BrowserRouter>
  </AppProvider>,
);
