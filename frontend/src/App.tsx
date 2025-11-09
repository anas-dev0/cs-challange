import React, { useEffect, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import InterviewerSetup from "./pages/InterviewerSetup";
import Interview from "./pages/Interview";
import CVTool from "./pages/CVTool";
import JobMatcher from "./pages/JobMatcher";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./AuthContext";
import { ServiceProvider } from "./ServiceContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/AuthModal";
import BackgroundShader from "./components/BackgroundShader";
import API from "./api";
import { User } from "./types";
import { Toaster, toast } from "sonner";
import { useTranslation } from "react-i18next";
import "./lib/i18n";
import "./App.css";
import Notfound from "./pages/Notfound";
import GetJobs from "./pages/GetJobs";
import NoJobsFound from "./pages/NoJobsFound";
function OAuthHandler() {
  const context = useContext(AuthContext);
  const location = useLocation();
  const hasProcessed = React.useRef(false);

  useEffect(() => {
    if (!context || hasProcessed.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      hasProcessed.current = true;

      // Store tokens
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Update token state in AuthContext
      context.setToken(token);

      // Clean URL immediately
      window.history.replaceState({}, "", "/");

      // Fetch user info
      API.get("/auth/me")
        .then((res) => {
          const user: User = res.data.user;
          context.setUser(user);
          toast.success(
            `Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}!`
          );
        })
        .catch((error) => {
          console.error("OAuth error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          context.setToken(null);
          toast.error("Failed to sign in. Please try again.");
        });
    }
  }, [location.search, context]);

  return null;
}
export default function App() {
  const { i18n } = useTranslation();

  // Update document direction based on language
  useEffect(() => {
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AuthProvider>
      <ServiceProvider>
        <div className="app-root">
          <Toaster
            richColors
            duration={3000}
            position="top-right"
            closeButton={true}
          />
          <OAuthHandler />
          {/* Global interactive shader background */}
          <BackgroundShader className="fixed inset-0 -z-10" />
          <Nav />
          <AuthModal />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route
                path="/interviewer/setup"
                element={
                  <ProtectedRoute>
                    <InterviewerSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviewer/session"
                element={
                  <ProtectedRoute>
                    <Interview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cv"
                element={
                  <ProtectedRoute>
                    <CVTool />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobMatcher />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/GetJobs"
                element={
                  <ProtectedRoute>
                    <GetJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/no-jobs-found"
                element={
                  <ProtectedRoute>
                    <NoJobsFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Notfound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ServiceProvider>
    </AuthProvider>
  );
}
