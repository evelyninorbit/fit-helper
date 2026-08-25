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

// 篩選器的預設年份：一進來就停在今年，月份才能直接選
export const getCurrentYear = () => dayjs().year();

// 篩選器的年份選項：資料裡出現過的年份，新的在前
// 一定包含今年——今年還沒有紀錄時，預設值才不會落在選單之外
export const getRecordYears = (records: Record[]) =>
  [
    ...new Set([
      getCurrentYear(),
      ...records.map((r) => dayjs(r.startedAt).year()),
    ]),
  ].sort((a, b) => b - a);

// 篩選器的預設月份：一進來就停在本月
export const getCurrentMonth = () => dayjs().month() + 1;

// 篩選器的月份選項：固定 1-12，不隨資料增減
// 選到沒有紀錄的月份時，畫面自己會顯示「這段期間沒有訓練紀錄」
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// 年份沒選就全部列出；只選年份則整年列出；月份只在有選年份時才生效
export const filterRecordsByYearMonth = (
  records: Record[],
  year: number | "",
  month: number | "",
) => {
  if (year === "") return records;
  return records.filter((r) => {
    const date = dayjs(r.startedAt);
    return date.year() === year && (month === "" || date.month() + 1 === month);
  });
};
