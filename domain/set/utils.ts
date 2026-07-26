import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

// duration 以「秒」存進 store，顯示時才轉成 00:00:00
const MAX_DURATION_SECONDS = 24 * 60 * 60 - 1; // 23:59:59

const formatDuration = (seconds: number) =>
  dayjs.duration(seconds, "seconds").format("HH:mm:ss");

// 輸入採計時器慣例：只取數字、由右往左填秒→分→時，例如打 "1234" = 00:12:34
const digitsToSeconds = (digits: string) => {
  const padded = digits.padStart(6, "0");
  return dayjs
    .duration({
      hours: Number(padded.slice(0, 2)),
      minutes: Number(padded.slice(2, 4)),
      seconds: Number(padded.slice(4, 6)),
    })
    .asSeconds();
};

export { MAX_DURATION_SECONDS, formatDuration, digitsToSeconds };