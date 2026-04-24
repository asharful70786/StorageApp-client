import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import UsersPage from "./UsersPage";
import Plans from "./Plans";
import Subscription from "./Subscription";
import NavBar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";
import LandingPage from "./LandingPage";
import TermsAndPrivacy from "./TermsAndPrivacy";



const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
  {
    path: "/plans",
    element: <Plans />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/features",
    element: <LandingPage />,
  },
  {
    path: "/terms",
    element: <TermsAndPrivacy />,
  },
]);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

 
      <main className="flex-1">
        <RouterProvider router={router} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
