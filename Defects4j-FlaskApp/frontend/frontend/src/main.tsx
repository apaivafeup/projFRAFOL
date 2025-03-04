import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AnalyzerView } from "./pages/Analyzer/Analyzer.view.tsx";
import { AppProvider } from "./context/index.tsx";
import { KillMatrix } from "./pages/KillMatrix/index.tsx";
import TeacherView from "./pages/TeacherView/TeacherView.index.tsx";
import StudentView from "./pages/StudentView/StudentView.index.tsx";
import ManageStudents from "./pages/TeacherView/ManageStudents/ManageStudents.view.tsx";
import ManageClasses from "./pages/TeacherView/ManageClasses/ManageClasses.view.tsx";
import Teacher from "./pages/TeacherView/Teacher.index.tsx";
import Submission from "./pages/StudentView/Submission/index.tsx";
import Navbar from "@components/Navbar/index.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <div className="flex flex-row w-full h-full">
          <div className="w-1/10">
            <Navbar />
          </div>
          <Routes>
            <Route path="/select-project" element={<App />} />
            <Route path="/analyzer" element={<AnalyzerView />} />
            <Route path="/kill-matrix" element={<KillMatrix />} />
            <Route path="/teacher-login" element={<TeacherView />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route
              path="/teacher/manage-students"
              element={<ManageStudents />}
            />
            <Route path="/teacher/manage-classes" element={<ManageClasses />} />
            <Route path="/student" element={<StudentView />} />
            <Route path="/student/submission" element={<Submission />} />
          </Routes>
        </div>
      </StrictMode>
    </BrowserRouter>
  </AppProvider>,
);
