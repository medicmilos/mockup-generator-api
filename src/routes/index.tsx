import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "@/features/layout/NotFound";
import { Home } from "@/features/screens/home/Home";

export enum routes {
  APP = "/",
}

export const AppRoutes = createBrowserRouter([
  {
    path: routes.APP,
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
