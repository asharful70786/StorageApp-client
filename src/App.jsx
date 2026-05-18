import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import { UsersPage } from "./UsersPage";
import Plans from "./Plans";
import Subscription from "./Subscription";
import Footer from "./components/Layout/Footer";
import LandingPage from "./LandingPage";
import TermsAndPrivacy from "./TermsAndPrivacy";
import PublicSharePage from "./public-share-page";
import { SharedByMePage } from "./shared-by-me-page";
import Settings from "./Settings";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import { useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <DirectoryView />
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/users",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <UsersPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/directory/:dirId",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <DirectoryView />
        </ProtectedRoute>
      ),
    },
    {
      path: "/plans",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Plans />
        </ProtectedRoute>
      ),
    },
    {
      path: "/subscription",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Subscription />
        </ProtectedRoute>
      ),
    },
    {
      path: "/features",
      element: <LandingPage />,
    },
    {
      path: "/terms",
      element: <TermsAndPrivacy />,
    },
    {
      path: "/share/:token",
      element: <PublicSharePage />,
    },
    {
      path: "/shared",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <SharedByMePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Settings />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
