"use client";
import { useExerciseStore } from "@/domain/exercise/store";
import dayjs from "dayjs";
import { formatDuration } from "@/domain/workout/utils";
import { addRecord } from "@/domain/record/store";
import {
  Container,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import useWorkoutStore, {
  updateWorkoutNote,
  resetWorkout,
  resumeWorkout,
} from "@/domain/workout/store";
import { getExerciseName } from "@/domain/exercise/utils";

export default function FinishWorkout() {
  const startedAt = useWorkoutStore((state) => state?.startedAt);
  const finishedAt = useWorkoutStore((state) => state?.finishedAt);
  const workoutDuration =
    startedAt && finishedAt ? formatDuration(startedAt, finishedAt) : "";

  const workoutDate = startedAt
    ? dayjs(startedAt).locale("zh-tw").format("YYYY年M月D日 ddd")
    : "";
  const workoutExercises = useWorkoutStore((s) => s?.exercise);
  const exercises = useExerciseStore((s) => s.exercises);

  const handleSaveRecord = () => {
    const workout = useWorkoutStore.getState();
    if (!workout?.finishedAt) return;
    addRecord({ ...workout, id: crypto.randomUUID() });
    resetWorkout();
  };
  const note = useWorkoutStore((s) => s?.note ?? "");
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
      <Typography sx={{ textAlign: "center", mt: 5 }}>{workoutDate}</Typography>
      {workoutDuration && (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          總時長：{workoutDuration}
        </Typography>
      )}
      <Stack
        sx={{
          width: "100%",
          height: "stretch",
          justifyContent: "space-between",
          py: 2,
          overflowY: "auto",
        }}
      >
        <List sx={{}}>
          {workoutExercises?.map((record) => (
            <ListItem
              key={record.id}
              sx={{
                py: 1,
                px: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 2,
                "&:not(:last-child)": {
                  mb: 1,
                },
              }}
            >
              <ListItemText
                primary={getExerciseName(record.exerciseId, exercises)}
              />
            </ListItem>
          ))}
        </List>
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
      <Stack
        sx={{
          width: "100%",

          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, height: 48, flex: 1, borderRadius: 2 }}
          onClick={() => resumeWorkout()}
        >
          返回
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, height: 48, flex: 1, borderRadius: 2 }}
          onClick={handleSaveRecord}
        >
          儲存
        </Button>
      </Stack>
    </Container>
  );
}
