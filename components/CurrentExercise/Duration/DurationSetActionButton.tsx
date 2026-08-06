import type { SxProps, Theme } from "@mui/material";
import { Grid, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

type DurationSetActionButtonProps = {
  // 倒數狀態：null = 沒在倒數（未開始或已結束）；running = false 表示暫停中
  countdown: { running: boolean } | null;
  // 這一組的倒數已經跑完，三顆都不該再有作用
  finished: boolean;
  // 倒數的實際操作由父層（DurationSetItem）管理，這裡只負責分派
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  // 提前結束這一組（時間還沒到就停）
  onStop: () => void;
  // 與其他按鈕共用的樣式，由外部傳入
  sx?: SxProps<Theme>;
  // 還沒設定倒數時間，不能開始
  startDisabled?: boolean;
};

export default function DurationSetActionButton({
  countdown,
  finished,
  onStart,
  onPause,
  onResume,
  onStop,
  sx,
  startDisabled,
}: DurationSetActionButtonProps) {
  // 每個狀態只留一顆按鈕可按，其餘一律 disabled（而非隱藏），避免誤觸也避免版面跳動
  const canStart = !finished && !countdown?.running && !startDisabled;
  const canPause = !!countdown?.running;
  const canStop = !finished && !!countdown;

  // 外部樣式擺後面，讓呼叫端仍能覆蓋寬度
  const buttonSx: SxProps<Theme> = [
    { width: "100%" },
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  return (
    <>
      <Grid size={4}>
        <IconButton
          sx={buttonSx}
          // 未開始 → 開始；暫停中 → 繼續
          onClick={countdown ? onResume : onStart}
          disabled={!canStart}
        >
          <PlayArrowIcon />
        </IconButton>
      </Grid>
      <Grid size={4}>
        <IconButton sx={buttonSx} onClick={onPause} disabled={!canPause}>
          <PauseIcon />
        </IconButton>
      </Grid>
      <Grid size={4}>
        <IconButton sx={buttonSx} onClick={onStop} disabled={!canStop}>
          <StopIcon />
        </IconButton>
      </Grid>
    </>
  );
}
