"use client";
import { Container, Stack, TextField } from "@mui/material";
import useWorkoutStore, { updateWorkoutNote } from "@/domain/workout/store";
import { getFinishedExercises } from "@/domain/workout/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import { getRecordBodyParts } from "@/domain/record/utils";
import FinishTimeMark from "./FinishTimeMark";
import FinishNavigationButton from "./FinishNavigationButton";
import FinishWorkoutList from "./FinishWorkoutList";

export default function FinishWorkout() {
  const note = useWorkoutStore((s) => s?.note ?? "");
  const startedAt = useWorkoutStore((s) => s?.startedAt ?? "");
  const finishedAt = useWorkoutStore((s) => s?.finishedAt ?? "");
  const workoutExercises = useWorkoutStore((s) => s?.exercise);
  const exercises = useExerciseStore((s) => s.exercises);
  // 只算真的有完成組數的動作，與 FinishWorkoutList、存檔時用同一份過濾邏輯；
  // 否則加進列表卻沒做的動作，部位也會被算進去
  const bodyParts = getRecordBodyParts(
    { exercise: getFinishedExercises(workoutExercises ?? []) },
    exercises,
  );
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "stretch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FinishTimeMark
        startedAt={startedAt}
        finishedAt={finishedAt}
        bodyParts={bodyParts}
      />
      <Stack
        sx={{
          width: "100%",
          height: "stretch",
          justifyContent: "space-between",
          py: 2,
          overflowY: "auto",
        }}
      >
        <FinishWorkoutList exercises={workoutExercises ?? []} />
        <TextField
          id="outlined-multiline-static"
          label="本日心得"
          value={note}
          multiline
          rows={5}
          sx={{ marginTop: 5 }}
          onChange={(e) => updateWorkoutNote(e.target.value)}
        />
      </Stack>
      <FinishNavigationButton />
    </Container>
  );
}
