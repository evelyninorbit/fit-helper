import dayjs from "dayjs";
// 副作用 import：載入中文星期名稱，直接進 /records 也不會退回英文
import "dayjs/locale/zh-tw";
import type { Record } from "./schema";
import type { Exercise } from "../exercise/schema";

// 清單的日期標題：2026/8/22 週五
export const formatRecordDate = (record: Pick<Record, "startedAt">) =>
  dayjs(record.startedAt).locale("zh-tw").format("YYYY/M/D ddd");

// 日期標題底下那一行只顯示時段：15:00-16:15
// 舊資料若沒有 finishedAt，就只顯示開始時間，不要印出半截的「-」
export const formatRecordTimeRange = (
  record: Pick<Record, "startedAt" | "finishedAt">,
) => {
  const startPart = dayjs(record.startedAt).format("HH:mm");
  return record.finishedAt
    ? `${startPart}-${dayjs(record.finishedAt).format("HH:mm")}`
    : startPart;
};

// 新的在最上面；回傳新陣列，不動到 store 裡的資料
export const sortRecordsByLatest = (records: Record[]) =>
  [...records].sort(
    (a, b) => dayjs(b.startedAt).valueOf() - dayjs(a.startedAt).valueOf(),
  );

// 同一天的多筆訓練收在同一個日期標題底下；
// 日期由新到舊，每天內部也由新到舊（沿用 sortRecordsByLatest 的排序）
export const groupRecordsByDate = (records: Record[]) => {
  const groups: { key: string; date: string; records: Record[] }[] = [];
  sortRecordsByLatest(records).forEach((record) => {
    const key = dayjs(record.startedAt).format("YYYY-MM-DD");
    const lastGroup = groups.at(-1);
    if (lastGroup?.key === key) {
      lastGroup.records.push(record);
      return;
    }
    groups.push({ key, date: formatRecordDate(record), records: [record] });
  });
  return groups;
};

// 當次訓練練到的部位，依動作出現順序去重（例：胸、背、腿）
// 找不到動作定義（例如被刪除）的就略過，不要在畫面上印出「未知」
export const getRecordBodyParts = (
  record: Pick<Record, "exercise">,
  exercises: Exercise[],
) => {
  const bodyParts = record.exercise
    .map((r) => exercises.find((e) => e.id === r.exerciseId)?.bodyPart)
    .filter((bodyPart): bodyPart is string => !!bodyPart);
  return [...new Set(bodyParts)];
};
