import type { SxProps, Theme } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import { updateSetTiming } from "@/domain/workout/store";
import type { SetBasicRecord } from "@/domain/set/schema";

type LoadSetActionButtonProps = {
  entryId: string;
  // 只用到共同欄位，重量型與計時型的組都能傳進來
  set: SetBasicRecord;
  // 該組是否已被使用者手動解鎖可編輯（結束後）
  editable: boolean;
  onToggleEditable: (setId: string) => void;
  // 與其他按鈕共用的樣式，由外部傳入
  sx?: SxProps<Theme>;
};

export default function LoadSetActionButton({
  entryId,
  set,
  editable,
  onToggleEditable,
  sx,
}: LoadSetActionButtonProps) {
  const handleClick = () => {
    if (set.startedAt && set.finishedAt) {
      // 已結束：僅切換可編輯，不動 startedAt / finishedAt
      onToggleEditable(set.id);
    } else if (set.startedAt) {
      // 進行中：記錄結束時間
      updateSetTiming(entryId, set.id, {
        finishedAt: new Date().toISOString(),
      });
    } else {
      // 未開始：記錄開始時間
      updateSetTiming(entryId, set.id, {
        startedAt: new Date().toISOString(),
        finishedAt: "",
      });
    }
  };

  return (
    <IconButton sx={sx} onClick={handleClick}>
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
  );
}
