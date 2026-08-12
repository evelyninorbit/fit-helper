import { Avatar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

type SetIndexBadgeProps = {
  // 顯示用的組次序（第幾組），從 0 起算
  index: number;
  // 是否為目前唯一可操作的組
  isActive: boolean;
  // 這一組已經做完
  finished: boolean;
};

// 組次序的三態徽章：已完成打勾、進行中實心、還沒輪到只有外框
export default function SetIndexBadge({
  index,
  isActive,
  finished,
}: SetIndexBadgeProps) {
  const highlighted = isActive || finished;

  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        fontSize: 16,
        bgcolor: finished
          ? "primary.dark"
          : isActive
            ? "primary.main"
            : "transparent",
        color: highlighted ? "#ffffff" : "text.disabled",
        border: highlighted ? 0 : 1,
        borderColor: "text.disabled",
      }}
    >
      {finished ? <CheckIcon fontSize="small" /> : index + 1}
    </Avatar>
  );
}
