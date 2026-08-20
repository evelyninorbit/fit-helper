"use client";
import { useState } from "react";
import { Grid, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useWorkoutStore, {
  updateDurationSet,
  updateSetTiming,
} from "@/domain/workout/store";
import { useExerciseStore } from "@/domain/exercise/store";
import type { SetRecordWithDuration } from "@/domain/set/schema";
import {
  MAX_DURATION_SECONDS,
  formatDuration,
  digitsToSeconds,
} from "@/domain/set/utils";
import SetItemCard from "../SetItemCard";
import SetIndexBadge from "../SetIndexBadge";
import DurationSetActionButton from "./DurationSetActionButton";
import useCountdown from "../useCountdown";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatIcon from "@mui/icons-material/Chat";
import SetNoteDialog from "../SetNoteDialog";
import RestBetweenSets from "../RestBetweenSets";

// 兩個按鈕共用的樣式
const iconButtonSx = {
  padding: 1,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "#ffffff",
  "&:hover": { bgcolor: "primary.light" },
  // 唯讀：保留原本配色但降透明度，游標改回一般箭頭，暗示現在按了沒作用
  '&[aria-disabled="true"]': {
    opacity: 0.5,
    cursor: "default",
    // 蓋掉上面的 hover 變色（屬性選擇器權重較高，會贏過 &:hover）
    "&:hover": { bgcolor: "primary.main" },
  },
};

type DurationSetItemProps = {
  entryId: string;
  set: SetRecordWithDuration;
  // 顯示用的組次序（第幾組）
  index: number;
  // 是否為目前唯一可操作的組（第一組尚未完成的）
  isActive: boolean;
  onRemove: () => void;
};

export default function DurationSetItem({
  entryId,
  set,
  index,
  isActive,
  onRemove,
}: DurationSetItemProps) {
  // 這一組結束後彈出的組間休息 dialog
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

  // 寫入 finishedAt 並開始組間休息；沒設定休息時間就不彈（否則 dialog 會開了又立刻關）
  const finishSet = () => {
    updateSetTiming(entryId, set.id, {
      finishedAt: new Date().toISOString(),
    });
    if (restSeconds > 0) setRestOpen(true);
  };

  // 這一組自己的倒數；歸零時把 finishedAt 寫回 store
  const { remaining, running, start, pause, resume, stop } =
    useCountdown(finishSet);

  // 倒數已跑完的組：欄位鎖定、不再顯示開始/暫停按鈕
  const finished = !!set.startedAt && !!set.finishedAt;
  // 倒數進行中或暫停中
  const counting = remaining !== null;
  // 防呆：還沒設定倒數時間（值為 0 時顯示空白）、或還輪不到這一組，就不能開始
  const startDisabled = !isActive || (!counting && set.duration === 0);
  const [noteOpen, setNoteOpen] = useState(false);
  const hasNote = set.note.trim() !== "";

  const handleStart = () => {
    if (set.duration === 0) return; // 還沒設定時間，不啟動
    updateSetTiming(entryId, set.id, {
      startedAt: new Date().toISOString(),
      finishedAt: "",
    });
    start(set.duration);
  };

  // 提前停止：把設定時間改寫成「實際做了多久」，這一組才是真實紀錄
  const handleStop = () => {
    const elapsed = set.duration - (remaining ?? 0);
    stop();
    if (elapsed <= 0) {
      // 一秒都還沒過就停：視為誤觸取消，退回未開始並保留原本設定的時間
      updateSetTiming(entryId, set.id, { startedAt: "", finishedAt: "" });
      return;
    }
    updateDurationSet(entryId, set.id, { duration: elapsed });
    finishSet();
  };

  const handleDurationChange = (inputValue: string) => {
    // 只留數字並取最後 6 碼（時時分分秒秒），多打的往左擠掉
    const digits = inputValue.replace(/\D/g, "").slice(-6);
    const seconds = digitsToSeconds(digits);
    if (seconds > MAX_DURATION_SECONDS) return;
    updateDurationSet(entryId, set.id, { duration: seconds });
  };

  return (
    <>
      <SetItemCard isActive={isActive} finished={finished}>
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center" }}
          rowSpacing={2.5}
        >
          <Grid size={2}>
            <SetIndexBadge
              index={index}
              isActive={isActive}
              finished={finished}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="倒數計時"
              variant="outlined"
              fullWidth
              type="text"
              inputMode="numeric"
              // 倒數進行中（含暫停）、已結束才鎖定輸入；還沒做的組可以先設定時間
              disabled={counting || finished}
              // 倒數中顯示剩餘時間，其他時候顯示設定值
              value={formatDuration(remaining ?? set.duration)}
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          </Grid>
          <Grid size={2} sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              sx={iconButtonSx}
              // 還沒開始的組不能寫筆記，避免跳著幫後面的組留紀錄
              onClick={() => set.startedAt && setNoteOpen(true)}
              aria-disabled={!set.startedAt}
              disableRipple={!set.startedAt}
            >
              {hasNote ? <ChatIcon /> : <ChatBubbleIcon />}
            </IconButton>
          </Grid>
          <Grid size={2}>
            <IconButton sx={iconButtonSx} onClick={onRemove}>
              <DeleteIcon />
            </IconButton>
          </Grid>
          {/* 開始／暫停／停止各佔一格，等寬；paddingX 與下方筆記欄相同，兩列才會等寬對齊 */}
          <Grid size={12} sx={{ paddingX: 4 }}>
            <Grid container spacing={2}>
              <DurationSetActionButton
                countdown={counting ? { running } : null}
                finished={finished}
                onStart={handleStart}
                onPause={pause}
                onResume={resume}
                onStop={handleStop}
                sx={iconButtonSx}
                startDisabled={startDisabled}
              />
            </Grid>
          </Grid>
        </Grid>
      </SetItemCard>
      <SetNoteDialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        index={index}
        note={set.note}
        onNoteChange={(note) => updateDurationSet(entryId, set.id, { note })}
      />
      <RestBetweenSets
        open={restOpen}
        seconds={restSeconds}
        onClose={() => setRestOpen(false)}
        note={set.note}
        onNoteChange={(note) => updateDurationSet(entryId, set.id, { note })}
      />
    </>
  );
}
