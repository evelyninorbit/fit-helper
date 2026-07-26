import dayjs from "dayjs";
import type { Workout } from "./schema";

export const isExerciseDone = (record: Workout["exercise"][number]) =>
  record.sets.length > 0 && record.sets.every((set) => set.finishedAt);

export const formatDuration = (startedAt: string, finishedAt: string) => {
  const minutes = dayjs(finishedAt).diff(startedAt, "minute");
  if (minutes < 0) return "";
  if (minutes < 1) return "未滿 1 分鐘";
  return minutes < 60
    ? `${minutes} 分鐘`
    : `${Math.floor(minutes / 60)} 小時 ${minutes % 60} 分鐘`;
};
