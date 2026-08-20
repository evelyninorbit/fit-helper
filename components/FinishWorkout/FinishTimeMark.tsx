import dayjs from "dayjs";
import { formatDuration } from "@/domain/workout/utils";
import { Typography } from "@mui/material";

type FinishTimeMarkProps = {
  startedAt: string;
  finishedAt: string;
};

// 資料由呼叫端傳入，所以進行中的訓練與已儲存的紀錄都能共用這塊時間標示
export default function FinishTimeMark({
  startedAt,
  finishedAt,
}: FinishTimeMarkProps) {
  const workoutDuration =
    startedAt && finishedAt ? formatDuration(startedAt, finishedAt) : "";

  const workoutDate = startedAt
    ? dayjs(startedAt).locale("zh-tw").format("YYYY/M/D ddd")
    : "";

  return (
    <>
      <Typography sx={{ textAlign: "center", mt: 5 }}>{workoutDate}</Typography>
      {workoutDuration && (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          總時長：{workoutDuration}
        </Typography>
      )}
    </>
  );
}
