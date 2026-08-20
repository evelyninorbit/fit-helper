import dayjs from "dayjs";
import type { Workout } from "./schema";
import { EExerciseType } from "../exercise/schema";

export const isExerciseDone = (record: Workout["exercise"][number]) =>
  record.sets.length > 0 && record.sets.every((set) => set.finishedAt);

// 只有寫入 finishedAt 的組才算真的做過；只按了新增、沒開始／結束的組不列入紀錄。
// 兩個分支內容相同，是為了讓 TS 沿著 exerciseType 收斂，filter 後仍是對應的 set 型別。
const pickFinishedSets = (record: Workout["exercise"][number]) =>
  record.exerciseType === EExerciseType.WEIGHT
    ? { ...record, sets: record.sets.filter((set) => !!set.finishedAt) }
    : { ...record, sets: record.sets.filter((set) => !!set.finishedAt) };

// 一次訓練中真的有做的動作：每個動作只留完成的組，完全沒完成任何一組的動作整筆濾掉
export const getFinishedExercises = (
  exercises: Workout["exercise"]
): Workout["exercise"] =>
  exercises.map(pickFinishedSets).filter((record) => record.sets.length > 0);

export const formatDuration = (startedAt: string, finishedAt: string) => {
  const minutes = dayjs(finishedAt).diff(startedAt, "minute");
  if (minutes < 0) return "";
  if (minutes < 1) return "未滿 1 分鐘";
  return minutes < 60
    ? `${minutes} 分鐘`
    : `${Math.floor(minutes / 60)} 小時 ${minutes % 60} 分鐘`;
};
