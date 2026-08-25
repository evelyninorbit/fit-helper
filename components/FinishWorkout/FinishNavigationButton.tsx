"use client";

import { useState } from "react";
import { Button, Stack } from "@mui/material";
import useWorkoutStore, {
  resetWorkout,
  resumeWorkout,
} from "@/domain/workout/store";
import { addRecord } from "@/domain/record/store";
import { getFinishedExercises } from "@/domain/workout/utils";
import FinishSavedDialog from "./FinishSavedDialog";

const buttonSx = {
  mt: 3,
  height: 48,
  flex: 1,
  borderRadius: 2,
  // 唯讀：保留原本配色但降透明度，游標改回一般箭頭，暗示現在按了沒作用
  '&[aria-disabled="true"]': {
    opacity: 0.5,
    cursor: "default",
    // 蓋掉 MUI 的 hover 變色（屬性選擇器權重較高，會贏過 &:hover）
    "&:hover": { bgcolor: "primary.main" },
  },
};

export default function FinishNavigationButton() {
  // 一組都沒完成就沒東西可存；用與儲存時同一份過濾邏輯判斷
  const workoutExercises = useWorkoutStore((s) => s?.exercise);
  const nothingToSave =
    getFinishedExercises(workoutExercises ?? []).length === 0;
  const [saved, setSaved] = useState(false);

  const handleSaveRecord = () => {
    // 唯讀狀態：外觀不變（不走 disabled），但點下去不做事
    if (nothingToSave) return;
    // 已經存過（完成對話框開著）就別再存第二筆
    if (saved) return;
    const workout = useWorkoutStore.getState();
    if (!workout?.finishedAt) return;
    // 沒有 finishedAt 的組（只新增、沒實際做）不寫進紀錄
    addRecord({
      ...workout,
      exercise: getFinishedExercises(workout.exercise),
      id: crypto.randomUUID(),
    });
    // 紀錄已寫入，先報喜；等使用者按確定才 resetWorkout 回到首頁
    setSaved(true);
  };

  const handleConfirmSaved = () => {
    setSaved(false);
    resetWorkout();
  };

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 3,
          paddingX: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={buttonSx}
          onClick={() => resumeWorkout()}
        >
          返回
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={buttonSx}
          onClick={handleSaveRecord}
          aria-disabled={nothingToSave}
          // 唯讀時不要有水波紋，免得看起來像真的按到了
          disableRipple={nothingToSave}
        >
          儲存
        </Button>
      </Stack>
      <FinishSavedDialog open={saved} onConfirm={handleConfirmSaved} />
    </>
  );
}
