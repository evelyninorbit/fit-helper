"use client";

import { Fab } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import useWorkoutStore from "@/domain/workout/store";
import { isExerciseDone } from "@/domain/workout/utils";

export default function FabStartWorkout() {
  const entryId = useWorkoutStore(
    (s) => (s?.exercise.find((e) => !isExerciseDone(e)) ?? s?.exercise[0])?.id,
  );

  return (
    <Fab
      href={entryId ? `/current-exercise?eid=${entryId}` : "/"}
      color="primary"
      aria-label="start"
      sx={{ marginBottom: 10, position: "absolute", right: 20, bottom: 0 }}
    >
      <PlayArrowIcon />
    </Fab>
  );
}
