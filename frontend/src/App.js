import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ProjectsPage from "./pages/ProjectsPage"
import ProjectDetailsPage from "./pages/ProjectDetailsPage"
import NewProjectPage from "./pages/NewProjectPage"
import DocumentsPage from "./pages/DocumentsPage"
import DocumentUploadPage from "./pages/DocumentUploadPage"
import MessagesPage from "./pages/MessagesPage"
import InvoicesPage from "./pages/InvoicesPage"
import OnboardingPage from "./pages/OnboardingPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import NotFoundPage from "./pages/NotFoundPage"

// Layout
import AppLayout from "./components/layouts/AppLayout"

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProjectsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NewProjectPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProjectDetailsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DocumentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/upload"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DocumentUploadPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MessagesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <InvoicesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OnboardingPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
