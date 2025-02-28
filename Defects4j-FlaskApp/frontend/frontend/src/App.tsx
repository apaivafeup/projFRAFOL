import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavbarView from "./components/Navbar/Navbar.view";
import WelcomeView from "./pages/Welcome/Welcome.view";
import AnalyzerView from "./pages/Analyzer/Analyzer.view";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex-1">
      <WelcomeView></WelcomeView>
    </div>
  );
}

export default App;
