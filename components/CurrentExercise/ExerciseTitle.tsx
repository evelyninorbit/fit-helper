import type { Exercise } from "@/domain/exercise/schema";
import { Typography } from "@mui/material";

type ExerciseTitleProps = {
  currentExercise: Exercise | undefined;
};

export default function ExerciseTitle({ currentExercise }: ExerciseTitleProps) {
  return (
    <Typography
      variant="h6"
      sx={{
        paddingX: 12,
        paddingY: 2,
        marginY: 6,
        bgcolor: "primary.main",
        color: "#ffffff",
        borderRadius: 2,
      }}
    >
      {currentExercise?.name}
    </Typography>
  );
}
