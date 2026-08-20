"use client";
import { currentExercise, getExerciseName } from "@/domain/exercise/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import type { Workout } from "@/domain/workout/schema";
import { EExerciseType, ELoadUnit } from "@/domain/exercise/schema";
import { Box, List, ListItem, Typography } from "@mui/material";
import { getFinishedExercises } from "@/domain/workout/utils";
import FinishExerciseItem from "./FinishExerciseItem";

type FinishWorkoutListProps = {
  // 進行中的訓練傳 workout store 的內容，已儲存的紀錄傳 record.exercise
  exercises: Workout["exercise"];
};

export default function FinishWorkoutList({
  exercises: workoutExercises,
}: FinishWorkoutListProps) {
  const exercises = useExerciseStore((s) => s.exercises);
  // 與儲存時同一份過濾邏輯：畫面上看到的就是實際會寫進紀錄的內容
  const finishedExercises = getFinishedExercises(workoutExercises);

  if (finishedExercises.length === 0) {
    return (
      <List sx={{ height: "100%" }}>
        <ListItem
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: 10,
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{
              textAlign: "center",
              border: "1px solid",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            本次沒有完成任何組數
            <br />
            返回繼續加油吧！
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "primary.main", opacity: 0.8 }}
          >
            溫馨提醒：
            <br />
            要按下開始與停止，才會算作完成組數喔！
          </Typography>
        </ListItem>
      </List>
    );
  }

  return (
    <List>
      {finishedExercises.map((record) => {
        const exercise = currentExercise(record.exerciseId, exercises);
        // 找不到動作定義（例如被刪除）時退回 kg，畫面不會空掉
        const loadUnit =
          exercise?.type === EExerciseType.WEIGHT
            ? exercise.loadUnit
            : ELoadUnit.KG;
        return (
          <Box key={record.id} sx={{ "&:not(:last-child)": { mb: 2 } }}>
            <FinishExerciseItem
              record={record}
              name={getExerciseName(record.exerciseId, exercises)}
              loadUnit={loadUnit}
            />
          </Box>
        );
      })}
    </List>
  );
}
