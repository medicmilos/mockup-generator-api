import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes";
import { Theme } from "@radix-ui/themes";

export const App = () => {
  return (
    <Theme appearance={"light"} accentColor="blue">
      <RouterProvider router={AppRoutes} />
    </Theme>
  );
};
