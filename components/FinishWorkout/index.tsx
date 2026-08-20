"use client";
import { Container, Stack, TextField } from "@mui/material";
import useWorkoutStore, { updateWorkoutNote } from "@/domain/workout/store";
import FinishTimeMark from "./FinishTimeMark";
import FinishNavigationButton from "./FinishNavigationButton";
import FinishWorkoutList from "./FinishWorkoutList";

export default function FinishWorkout() {
  const note = useWorkoutStore((s) => s?.note ?? "");
  const startedAt = useWorkoutStore((s) => s?.startedAt ?? "");
  const finishedAt = useWorkoutStore((s) => s?.finishedAt ?? "");
  const exercises = useWorkoutStore((s) => s?.exercise);
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
      <FinishTimeMark startedAt={startedAt} finishedAt={finishedAt} />
      <Stack
        sx={{
          width: "100%",
          height: "stretch",
          justifyContent: "space-between",
          py: 2,
          overflowY: "auto",
        }}
      >
        <FinishWorkoutList exercises={exercises ?? []} />
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
