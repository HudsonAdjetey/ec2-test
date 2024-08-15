import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./container/pages/LandingPage";
import Login from "./container/pages/Login";
import SignUp from "./container/pages/SignUp";
import { useSelector } from "react-redux";
import Home from "./container/pages/Home";
import NavDSK from "./components/NavMenu/NavDSK";
import Account from "./container/pages/Account";
import Student from "./container/pages/Student";
import Classes from "./container/pages/Classes";
import Subscription from "./container/pages/Subscription";
import Schedule from "./container/pages/Schedule";
import Settings from "./container/pages/Settings";
import ErrorBoundary from "./components/Model/ErrorBoundary";
import ErrorPage from "./components/Model/ErrorPage";
import AdminNav from "./components/NavMenu/AdminNavDsk";
import Dashboard from "./container/pages/Dashboard";
import ToastContainers from "./components/toastify/ToastContainer";

const App = () => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.va1 === import.meta.env.VITE_VAL;
  const isStudent = user?.va1 == "Student";
  // check for admin user
  const AuthGuard = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (isStudent) {
        navigate("/");
      } else if (isAdmin) {
        navigate("/dashboard");
      }
    }, [navigate, user]);
    return children;
  };

  const UserLayout = ({ children }) =>
    isStudent ? (
      <ErrorBoundary>
        <section className="xl-main-container">
          <NavDSK />
          {children}
        </section>
      </ErrorBoundary>
    ) : (
      <Navigate to="/home" replace />
    );

  const AdminLayout = ({ children }) =>
    isAdmin ? (
      <section className="xl-main-container">
        <AdminNav />
        {children}
      </section>
    ) : (
      <Navigate to="/home" replace />
    );

  const router = createBrowserRouter([
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/home",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <AuthGuard>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthGuard>
          <SignUp />
        </AuthGuard>
      ),
    },
    {
      path: "/",
      element: (
        <UserLayout>
          <Outlet />
        </UserLayout>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/subscription",
          element: <Subscription />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      ),
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/dashboard/classes",
          element: <Classes />,
        },
        {
          path: "/dashboard/student",
          element: <Student />,
        },
        {
          path: "/dashboard/account",
          element: <Account />,
        },

        {
          path: "/dashboard/schedule",
          element: <Schedule />,
        },
        {
          path: "/dashboard/settings",
          element: <Settings />,
        },
      ],
    },
  ]);
  return (
    <>
      <ErrorBoundary>
        <ToastContainers />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </>
  );
};

export default App;
