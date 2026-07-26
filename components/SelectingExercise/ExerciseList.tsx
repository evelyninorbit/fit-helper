"use client";

import { useExerciseStore } from "@/domain/exercise/store";
import { getExerciseName } from "@/domain/exercise/utils";
import useWorkoutStore, {
  removeExerciseFromWorkout,
} from "@/domain/workout/store";
import { isExerciseDone } from "@/domain/workout/utils";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";

const ExerciseList: React.FC = () => {
  const workoutExercises = useWorkoutStore((s) => s?.exercise);
  const exercises = useExerciseStore((s) => s.exercises);

  return (
    <List sx={{ width: 1 / 1 }}>
      {workoutExercises?.map((record) => {
        const isDone = isExerciseDone(record);

        return (
          <ListItem
            key={record.id}
            sx={{
              py: 1,
              px: 2,
              border: "1px solid",
              borderColor: "primary.main",
              color: isDone ? "primary.contrastText" : "primary.main",
              bgcolor: isDone ? "primary.main" : undefined,
              borderRadius: 2,

              mb: 2,
            }}
          >
            <ListItemText
              primary={getExerciseName(record.exerciseId, exercises)}
            />
            <IconButton
              sx={{ color: isDone ? "primary.contrastText" : "primary.main" }}
              size="small"
              aria-label="移除動作"
              onClick={() => removeExerciseFromWorkout(record.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ExerciseList;
