import React from "react";
import CVTool from "./pages/CVTool";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="app-root">
      <Toaster richColors duration={3000} position="top-right" closeButton={true} />
      {/* Simple gradient background - compatible with all React versions */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-secondary/20" />

      {/* We are only rendering the CVTool page */}
      <main>
        <CVTool />
      </main>
    </div>
  );
}

export default App;