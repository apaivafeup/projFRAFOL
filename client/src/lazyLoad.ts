import { lazy } from "react";

// Define a static map of import functions
const moduleMap: Record<string, () => Promise<any>> = {
    App: () => import("./App.tsx"),
    Analyzer: () => import("./pages/Analyzer"),
    TeacherDashboard: () => import("./pages/TeacherView/Teacher.index.tsx"),
    TeacherView: () => import("./pages/TeacherView/TeacherView.index.tsx"),
    KillMatrix: () => import("./pages/KillMatrix/index.tsx"),
    Submission: () => import("./pages/StudentView/Submission/index.tsx"),
    Student: () => import("./pages/StudentView"),
    Navbar: () => import("./components/Navbar/index.tsx"),
};

// Named export support is retained if needed
export const lazyLoad = (componentName: keyof typeof moduleMap, namedExport?: string) => {
    const importer = moduleMap[componentName];
    return lazy(() =>
        importer().then(module => ({
            default: namedExport ? module[namedExport] : module.default,
        }))
    );
};
