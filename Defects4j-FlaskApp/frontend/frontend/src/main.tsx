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
import StudentView from "./pages/StudentView/StudentView.index.tsx";
import ManageStudents from "./pages/TeacherView/ManageStudents/ManageStudents.view.tsx";
import ManageClasses from "./pages/TeacherView/ManageClasses/ManageClasses.view.tsx";
import Teacher from "./pages/TeacherView/Teacher.index.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <div className="flex flex-row w-full h-full">
          <div className="w-1/10">
          <NavbarView />
          </div>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/analyzer" element={<AnalyzerView />} />
            <Route path="/kill-matrix" element={<KillMatrix />} />
            <Route path="/teacher-login" element={<TeacherView />}/>
            <Route path="/teacher" element={<Teacher />}/>
            <Route path="/teacher/manage-students" element={<ManageStudents />} />
            <Route path="/teacher/manage-classes" element={<ManageClasses />} />
            <Route path="/student" element={<StudentView />} />
          </Routes>
        </div>
      </StrictMode>
    </BrowserRouter>
  </AppProvider>,
);
