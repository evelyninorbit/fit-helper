"use client";

import {
  Container,
  Avatar,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NextLink from "@/components/NextLink";
import useWorkoutStore, {
  startWorkout,
  updateWorkoutNote,
  resetWorkout,
  resumeWorkout,
} from "@/domain/workout/store";
import { addRecord } from "@/domain/record/store";
import Settings from "@/components/Settings";
import WorkoutBottomNavigation from "@/components/WorkoutBottomNavigation";
import { AddExercise, ExerciseList } from "@/components/SelectingExercise";
import { getExerciseName } from "@/domain/exercise/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import { formatDuration } from "@/domain/workout/utils";
const RootWithWorkout: React.FC = () => (
  <>
    <Container
      maxWidth="xs"
      sx={{
        pt: 2,
        flexGrow: 1,
        flexShrink: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        mb: 2,
      }}
    >
      <ExerciseList />
      <AddExercise />
      
    </Container>

    <WorkoutBottomNavigation />
  </>
);

const RootWithoutWorkout: React.FC = () => {
  const handleStartWorkout = () => {
    startWorkout();
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "stretch",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        direction="column"
        spacing={10}
        sx={{
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80 }} />

        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: 200,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ height: 64, px: 4, justifyContent: "space-between" }}
            onClick={handleStartWorkout}
            startIcon={<DirectionsWalkRoundedIcon />}
          >
            開始運動
          </Button>
          <Settings slotProps={{ trigger: { sx: { width: "100%" } } }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ height: 64, px: 4, justifyContent: "space-between" }}
              startIcon={<SettingsIcon />}
            >
              設定動作
            </Button>
          </Settings>
          <Button
            LinkComponent={NextLink}
            href="/records"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ height: 64, px: 4, justifyContent: "space-between" }}
            startIcon={<LibraryBooksIcon />}
          >
            查看紀錄
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

const RootFinishWorkout: React.FC = () => {
  const startedAt = useWorkoutStore((state) => state?.startedAt);
  const finishedAt = useWorkoutStore((state) => state?.finishedAt);

  const workoutDuration =
    startedAt && finishedAt ? formatDuration(startedAt, finishedAt) : "";

  const workoutDate = startedAt
    ? new Date(startedAt).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
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
          width:'100%',
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
          width:'100%',

          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, height: 48, flex: 1,borderRadius:2 }}
          onClick={() => resumeWorkout()}
        >
          返回
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, height: 48, flex: 1,borderRadius:2 }}
          onClick={handleSaveRecord}
        >
          儲存
        </Button>
      </Stack>
    </Container>
  );
};

const RootPage: React.FC = () => {
  const workout = useWorkoutStore((state) => state);

  return workout === null ? (
    <>載入畫面</>
  ) : workout.finishedAt ? (
    <RootFinishWorkout />
  ) : workout.startedAt ? (
    <RootWithWorkout />
  ) : (
    <RootWithoutWorkout />
  );
};

export default RootPage;
