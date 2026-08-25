import dayjs from "dayjs";
import { formatDuration } from "@/domain/workout/utils";
import { List, ListItemText, Typography } from "@mui/material";

type FinishTimeMarkProps = {
  startedAt: string;
  finishedAt: string;
  // 呼叫端畫面上已經有日期時（例如日曆選了哪天）就關掉，不要重複顯示
  showDate?: boolean;
  // 當次練到的部位。要對照動作定義才算得出來，所以跟時間一樣由呼叫端算好傳入
  bodyParts?: string[];
};

// 資料由呼叫端傳入，所以進行中的訓練與已儲存的紀錄都能共用這塊時間標示
export default function FinishTimeMark({
  startedAt,
  finishedAt,
  showDate = true,
  bodyParts = [],
}: FinishTimeMarkProps) {
  const workoutDuration =
    startedAt && finishedAt ? formatDuration(startedAt, finishedAt) : "";

  const workoutDate = startedAt
    ? dayjs(startedAt).locale("zh-tw").format("YYYY/M/D ddd")
    : "";

  return (
    <>
      {showDate && (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
          {workoutDate}
        </Typography>
      )}
      <List
        sx={{
          display: "flex",
          gap: 2,
          py: 0,
          mt: showDate ? 2 : 3,
          width: "100%",
        }}
      >
        <ListItemText
          primary="總時長"
          // 舊資料可能沒有 finishedAt，算不出時長就顯示 - 而不是空白
          secondary={workoutDuration || "-"}
          sx={{ textAlign: "center" }}
        />
        <ListItemText
          primary="運動部位"
          secondary={bodyParts.length > 0 ? bodyParts.join("、") : "-"}
          sx={{ textAlign: "center" }}
        />
      </List>
    </>
  );
}
