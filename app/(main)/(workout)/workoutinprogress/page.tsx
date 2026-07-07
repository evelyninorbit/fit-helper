"use client";
import {
  Button,
  Box,
  Container,
  IconButton,
  ButtonGroup,
  List,
  ListItem,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useWorkoutStore from "@/domain/workout/store";
import { useExercises } from "@/domain/exercise/store";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import NextLink from "next/link";
import { addRecord } from "@/domain/record/store";
import {
  resetWorkout,
  removeExerciseFromWorkout,
} from "@/domain/workout/store";

export default function WorkoutInProgress() {
  const workout = useWorkoutStore((state) => state);
  const exercises = useExercises();
  const router = useRouter();

  // 儲存/刪除時先轉頁，store 留到本頁 unmount（轉頁完成）才清，畫面才不會先閃空清單
  const finishing = useRef(false);

  useEffect(() => {
    return () => {
      if (finishing.current) resetWorkout();
    };
  }, []);

  useEffect(() => {
    if (finishing.current) return;
    if (workout !== null && !workout.startedAt) router.replace("/");
  }, [workout, router]);

  // record 只存 exerciseId，顯示名稱要回 exercise store 查
  const exerciseName = (exerciseId: number) =>
    exercises.find((e) => e.id === exerciseId)?.name ?? "未知動作";

  const handleCompleteWorkout = () => {
    if (!workout?.startedAt) return;
    finishing.current = true;
    addRecord({
      ...workout,
      id: crypto.randomUUID(),
      finishedAt: new Date().toISOString(),
    });
    router.replace("/finishworkout");
  };

  const handleDeleteWorkout = () => {
    if (!workout?.startedAt) return;
    finishing.current = true;
    router.replace("/");
  }

  return (
    // maxWidth="sm"：手機全寬、桌機收成 600px 中欄，整個 app 的版心
    <Container maxWidth="sm" sx={{ textAlign: "center", height: "100dvh" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center",pb: 12 }}
      >
        {/* pb 預留底部 fixed 按鈕的空間，清單長的時候最後幾項才不會被蓋住 */}
        <List sx={{ width:{xs: "80%", sm: "50%"} }}>
          {workout?.exercise.map((record, index) => (
            <ListItem
              key={record.id}
              sx={{
                bgcolor: "primary.light",
                color:'primary.contrastText',
                my: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                component="span"
                sx={{
                    mr: 2,
                    width: 24,
                    height: 24,
                    borderRadius:2,
                    bgcolor: 'primary.contrastText',
                    color: 'primary.light',
                    fontSize: 14,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
              >
                {index + 1}
              </Box>
              <Box component="span" sx={{ mr: "auto" }}>
                {exerciseName(record.exerciseId)}
              </Box>
              <IconButton
                sx={{ color: "primary.contrastText" }}
                size="small"
                aria-label="移除動作"
                onClick={() => removeExerciseFromWorkout(record.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Button
          LinkComponent={NextLink}
          href="/addexercisetoworkout"
          variant="contained"
          color="primary"
          sx={{
            justifyContent:"space-between",
            // 手機全寬好按，600px 以上收窄免得像一條橫幅
            width: { xs: "80%", sm: "50%" },
            height: 56,
            px: 4,
          }}
          startIcon={<AddIcon />}
        >
          新增運動
        </Button>
        
      </Box>
      <ButtonGroup
          variant="contained"
          sx={{
            // 底部操作列：手機貼滿全寬（行動裝置慣例），桌機對齊 600px 版心
            width: { xs: "100%", sm: 600 },
            bgcolor: "primary.main",
            justifyContent: "space-around",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            mx: "auto",
            py: 1,
          }}
        >
          <IconButton >
            <DeleteIcon sx={{ color: "primary.contrastText"}} onClick={handleDeleteWorkout}/>
          </IconButton>
          <IconButton sx={{ color: "primary.contrastText" }} onClick={handleCompleteWorkout}>
            <SaveIcon />
          </IconButton>
        </ButtonGroup>
    </Container>
  );
}
