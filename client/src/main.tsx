import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppProvider } from "./context/index.tsx";
import { lazyLoad } from "./lazyLoad";
import { Loader } from "@components/Loader";

const App = lazyLoad("App");
const Analyzer = lazyLoad("Analyzer");
const TeacherDashboard = lazyLoad("TeacherDashboard");
const TeacherView = lazyLoad("TeacherView");
const KillMatrix = lazyLoad("KillMatrix");
const Submission = lazyLoad("Submission");
const Student = lazyLoad("Student");
const Navbar = lazyLoad("Navbar");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <AppProvider>
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
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/student" element={<Student />} />
              <Route path="/student/submission" element={<Submission />} />
            </Routes>
          </div>
        </AppProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>

);
