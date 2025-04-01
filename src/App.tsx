import FileComparison from "./components/FileComparison";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <FileComparison />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
