import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./components/Header";
import "./lib/i18n";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Router>
        <Toaster
          richColors
          duration={3000}
          position="top-right"
          closeButton={true}
        />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
