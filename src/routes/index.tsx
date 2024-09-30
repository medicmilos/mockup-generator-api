import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "@/features/layout/NotFound";
import { Home } from "@/features/screens/home/Home";
import { Editor } from "@/features/screens/editor/Editor";

export enum routes {
  APP = "/",
  EDITOR = "/mockup/:mockupUuid",
  COLLECTION = "/collection/:collectionUuid",
}

export const AppRoutes = createBrowserRouter([
  {
    path: routes.APP,
    element: <Home />,
  },
  {
    path: routes.COLLECTION,
    element: <Home />,
  },
  {
    path: routes.EDITOR,
    element: <Editor />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
