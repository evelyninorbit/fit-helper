"use client";

import { Grid, Typography, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateDurationSet, updateSetTiming } from "@/domain/workout/store";
import type { SetRecordWithDuration } from "@/domain/set/schema";
import {
  MAX_DURATION_SECONDS,
  formatDuration,
  digitsToSeconds,
} from "@/domain/set/utils";
import DurationSetActionButton from "./DurationSetActionButton";
import useCountdown from "../useCountdown";

// 兩個按鈕共用的樣式
const iconButtonSx = {
  padding: 1,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "#ffffff",
  "&:hover": { bgcolor: "primary.light" },
  "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
};

type DurationSetItemProps = {
  entryId: string;
  set: SetRecordWithDuration;
  // 顯示用的組次序（第幾組）
  index: number;
  onRemove: () => void;
};

export default function DurationSetItem({
  entryId,
  set,
  index,
  onRemove,
}: DurationSetItemProps) {
  // 這一組自己的倒數；歸零時把 finishedAt 寫回 store
  const { remaining, running, start, pause, resume, stop } = useCountdown(
    () => {
      updateSetTiming(entryId, set.id, {
        finishedAt: new Date().toISOString(),
      });
    }
  );

  // 倒數已跑完的組：欄位鎖定、不再顯示開始/暫停按鈕
  const finished = !!set.startedAt && !!set.finishedAt;
  // 倒數進行中或暫停中
  const counting = remaining !== null;
  // 防呆：還沒設定倒數時間（值為 0 時顯示空白）就不能開始該組
  const startDisabled = !counting && set.duration === 0;

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
    updateSetTiming(entryId, set.id, { finishedAt: new Date().toISOString() });
  };

  const handleDurationChange = (inputValue: string) => {
    // 只留數字並取最後 6 碼（時時分分秒秒），多打的往左擠掉
    const digits = inputValue.replace(/\D/g, "").slice(-6);
    const seconds = digitsToSeconds(digits);
    if (seconds > MAX_DURATION_SECONDS) return;
    updateDurationSet(entryId, set.id, { duration: seconds });
  };

  return (
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      <Grid size={1}>
        <Typography sx={{ paddingY: 1, borderRadius: 2 }}>
          {index + 1}
        </Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          label="倒數計時"
          variant="outlined"
          fullWidth
          type="text"
          inputMode="numeric"
          // 倒數進行中（含暫停）與已結束的組鎖定輸入
          disabled={counting || finished}
          // 倒數中顯示剩餘時間，其他時候顯示設定值
          value={formatDuration(remaining ?? set.duration)}
          onChange={(e) => handleDurationChange(e.target.value)}
        />
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

      <Grid size={12} sx={{ paddingX: 4 }}>
        <TextField
          label="該組筆記"
          variant="outlined"
          multiline
          maxRows={5}
          fullWidth
          value={set.note}
          onChange={(e) =>
            updateDurationSet(entryId, set.id, { note: e.target.value })
          }
        />
      </Grid>
    </Grid>
  );
}
