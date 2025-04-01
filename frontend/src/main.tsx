import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const Root = () => {
  const { authUser, onlineUsers, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(onlineUsers);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: authUser ? <Home /> : <Navigate to="/login" /> },
        {
          path: "/signup",
          element: authUser ? <Navigate to="/" /> : <Signup />,
        },
        { path: "/login", element: authUser ? <Navigate to="/" /> : <Login /> },
        {
          path: "/settings",
          element: authUser ? <Settings /> : <Navigate to="/login" />,
        },
        {
          path: "/profile",
          element: authUser ? <Profile /> : <Navigate to="/login" />,
        },
      ],
    },
  ]);
  return <RouterProvider key={authUser ? "auth" : "guest"} router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root/>
  </StrictMode>
);
