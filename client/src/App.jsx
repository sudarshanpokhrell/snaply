import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./context/authContext"; // Import the custom auth context

import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Profile from "./pages/User";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Post from "./pages/Post";

const App = () => {
  const { authUser } = useAuthContext(); // Get the authUser from context

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes under RootLayout */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/create"
            element={
              authUser ? <Create /> : <Navigate to="/auth/login" replace />
            }
          />
          <Route
            path="/profile"
            element={
              authUser ? <Profile /> : <Navigate to="/auth/login" replace />
            }
          />
          <Route path="/u/:userId" element={<User />} />
          <Route path="/p/:postId" element={<Post />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          {/* Redirect from /auth to /auth/login */}
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route
            path="login"
            element={authUser ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="register"
            element={authUser ? <Navigate to="/" replace /> : <Register />}
          />
        </Route>

        {/* Catch-all route to prevent unauthorized access */}
        <Route path="/auth/*" element={<Navigate to="/auth/login" replace />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
