"use client";

import { Container, Avatar, Button, Stack } from "@mui/material";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NextLink from "@/components/NextLink";
import useWorkoutStore, { startWorkout } from "@/domain/workout/store";
import Settings from "@/components/Settings";
import WorkoutBottomNavigation from "@/components/WorkoutBottomNavigation";
import { AddExercise, ExerciseList } from "@/components/SelectingExercise";
import "dayjs/locale/zh-tw";
import FinishWorkout from "@/components/FinishWorkout";
import FabStartWorkout from "@/components/SelectingExercise/FAB-StartWorkout";

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
    <FabStartWorkout />
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

const RootPage: React.FC = () => {
  const workout = useWorkoutStore((state) => state);

  return workout === null ? (
    <>載入畫面</>
  ) : workout.finishedAt ? (
    <FinishWorkout />
  ) : workout.startedAt ? (
    <RootWithWorkout />
  ) : (
    <RootWithoutWorkout />
  );
};

export default RootPage;
