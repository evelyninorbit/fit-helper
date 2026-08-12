import type { ReactNode } from "react";
import { Paper } from "@mui/material";

type SetItemCardProps = {
  // 是否為目前唯一可操作的組
  isActive: boolean;
  // 這一組已經做完
  finished: boolean;
  children: ReactNode;
};

// 每一組的外框：只有現在該做的那組浮起來、其餘往後退，讓視線只落在一個地方
export default function SetItemCard({
  isActive,
  finished,
  children,
}: SetItemCardProps) {
  return (
    <Paper
      elevation={0}
      // 給 useActiveSetScroll 找目標用：現在該做的那組會被自動捲到畫面中央
      data-active-set={isActive ? "true" : undefined}
      sx={{
        padding: 2,
        borderRadius: 2,
        // 左側色條只在進行中的那組出現（透明佔位，避免其他組往左位移）
        borderLeft: 4,
        borderColor: isActive ? "primary.main" : "transparent",
        // 未輪到的組壓暗退到背景色，已完成的組保持可讀
        bgcolor: isActive ? "background.default" : "transparent",
        opacity: isActive || finished ? 1 : 0.5,
        transition: "opacity .2s, box-shadow .2s, background-color .2s",
      }}
    >
      {children}
    </Paper>
  );
}
