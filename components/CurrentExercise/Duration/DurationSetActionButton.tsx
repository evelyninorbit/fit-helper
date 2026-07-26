import type { SxProps, Theme } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type DurationSetActionButtonProps = {
  // 倒數狀態：null = 沒在倒數（未開始或已結束）；running = false 表示暫停中
  countdown: { running: boolean } | null;
  // 倒數的實際操作由父層（SetWithDuration）管理，這顆按鈕只負責分派
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  // 與其他按鈕共用的樣式，由外部傳入
  sx?: SxProps<Theme>;
};

export default function DurationSetActionButton({
  countdown,
  onStart,
  onPause,
  onResume,
  sx,
}: DurationSetActionButtonProps) {
  const handleClick = () => {
    if (countdown?.running) {
      // 倒數中：暫停
      onPause();
    } else if (countdown) {
      // 暫停中：繼續倒數
      onResume();
    } else {
      // 未開始或已結束：啟動（重新）倒數
      onStart();
    }
  };

  return (
    <IconButton sx={sx} onClick={handleClick}>
      {countdown?.running ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );
}
