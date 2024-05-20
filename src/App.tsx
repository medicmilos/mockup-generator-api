import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes";
import { Box, Theme } from "@radix-ui/themes";

export const App = () => {
  return (
    <Theme appearance={"light"} accentColor="blue">
      <Box height={"100%"} style={{ maxWidth: "2560px", margin: "0 auto" }}>
        <RouterProvider router={AppRoutes} />
      </Box>
    </Theme>
  );
};
