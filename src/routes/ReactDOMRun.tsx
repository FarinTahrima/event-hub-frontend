import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "@/utils/root";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import NotFoundPage from "@/pages/NotFoundPage";

import HostRegisterPage from "@/pages/host/HostRegisterPage.tsx";
import GamePage from "@/pages/GamePage.tsx";
import HostHomePage from "@/pages/host/HostHomePage.tsx";

interface ReactDOMRunProps {
}

const ReactDOMRun: React.FC<ReactDOMRunProps> = () => {
  return (
      <>
        <RouterProvider router={router} />
      </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // This will serve at the root path ("/")
        element: <LandingPage />, // Render LandingPage at the root
      },
      {
        path: "home",
        element: (
            <ProtectedRoute>
              <HostHomePage />
            </ProtectedRoute>
        ),
      },
      {
        path: "game",
        element: (
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "404",
    element: <NotFoundPage />,
  },
  // catches all invalid routes
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

export default ReactDOMRun;