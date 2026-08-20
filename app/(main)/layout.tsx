"use client";

import useWorkoutStore from "@/domain/workout/store";
import { Box } from "@mui/material";

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loading = useWorkoutStore((state) => state === null);

  return loading ? null : (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        "> *": {
          flex: "0 0 auto",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MainLayout;
