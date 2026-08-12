"use client";

import { useState } from "react";
import type { SxProps, Theme } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import useWorkoutStore, { updateSetTiming } from "@/domain/workout/store";
import { useExerciseStore } from "@/domain/exercise/store";
import type { SetBasicRecord } from "@/domain/set/schema";
import RestBetweenSets from "../RestBetweenSets";

type LoadSetActionButtonProps = {
  entryId: string;
  // 只用到共同欄位，重量型與計時型的組都能傳進來
  set: SetBasicRecord;
  // 該組是否已被使用者手動解鎖可編輯（結束後）
  editable: boolean;
  onToggleEditable: (setId: string) => void;
  // 與其他按鈕共用的樣式，由外部傳入
  sx?: SxProps<Theme>;
  // 唯讀：按鈕仍維持原本外觀與焦點，只是點擊不觸發任何動作
  disabled?: boolean;
};

export default function LoadSetActionButton({
  entryId,
  set,
  editable,
  onToggleEditable,
  sx,
  disabled,
}: LoadSetActionButtonProps) {
  // 按下停止後彈出的組間休息 dialog
  const [restOpen, setRestOpen] = useState(false);

  // 這一組屬於哪個動作，決定休息幾秒（Settings 可調）
  const exerciseId = useWorkoutStore(
    (s) => s?.exercise.find((e) => e.id === entryId)?.exerciseId
  );
  const restSeconds =
    useExerciseStore((s) =>
      exerciseId === undefined
        ? undefined
        : s.exercises.find((e) => e.id === exerciseId)?.restTime
    ) ?? 0;

  const handleClick = () => {
    // 唯讀狀態：外觀不變（不走 disabled），但點下去不做事
    if (disabled) return;
    if (set.startedAt && set.finishedAt) {
      // 已結束：僅切換可編輯，不動 startedAt / finishedAt
      onToggleEditable(set.id);
    } else if (set.startedAt) {
      // 進行中：記錄結束時間，並開始組間休息
      updateSetTiming(entryId, set.id, {
        finishedAt: new Date().toISOString(),
      });
      // 沒設定休息時間就不彈（否則 dialog 會開了又立刻關）
      if (restSeconds > 0) setRestOpen(true);
    } else {
      // 未開始：記錄開始時間
      updateSetTiming(entryId, set.id, {
        startedAt: new Date().toISOString(),
        finishedAt: "",
      });
    }
  };

  return (
    <>
      <IconButton
        sx={sx}
        onClick={handleClick}
        aria-disabled={disabled}
        // 唯讀時不要有水波紋，免得看起來像真的按到了
        disableRipple={disabled}
      >
        {set.startedAt && set.finishedAt ? (
          editable ? (
            <CheckIcon />
          ) : (
            <CreateIcon />
          )
        ) : set.startedAt ? (
          <StopIcon />
        ) : (
          <PlayArrowIcon />
        )}
      </IconButton>
      <RestBetweenSets
        open={restOpen}
        seconds={restSeconds}
        onClose={() => setRestOpen(false)}
        note={set.note}
        onNoteChange={(note) => updateSetTiming(entryId, set.id, { note })}
      />
    </>
  );
}
