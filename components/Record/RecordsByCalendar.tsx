"use client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Badge } from "@mui/material";
import { PickerDay, PickerDayProps } from "@mui/x-date-pickers";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useRecordsStore } from "@/domain/record/store";
import { sortRecordsByLatest } from "@/domain/record/utils";
import RecordDetailBelowCalendar from "./RecordDetailBelowCalendar";

function ServerDay(props: PickerDayProps & { highlightedDays: number[] }) {
  const { highlightedDays, day, outsideCurrentMonth, ...other } = props;

  const hasRecord =
    !outsideCurrentMonth && highlightedDays.includes(day.date());

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasRecord ? "💪" : undefined}
    >
      <PickerDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default function RecordsByLCalendar() {
  const records = useRecordsStore((s) => s.records);
  // 存整個 dayjs 而不是 month()：只存月份的話，跨年切換時 12 月的紀錄會標到別年的 12 月
  const [currentMonth, setcurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  // 預設選今天，一進畫面日曆下方就有東西可看（沒練就顯示「這天沒有訓練紀錄」）
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  // 只算當前顯示月份的日子，去重後給 ServerDay 比對
  const highlightedDays = useMemo(() => {
    const days = records
      .filter((record) => dayjs(record.startedAt).isSame(currentMonth, "month"))
      .map((record) => dayjs(record.startedAt).date());
    return [...new Set(days)];
  }, [records, currentMonth]);

  // 選中日期當天的紀錄，由新到舊，交給下方的詳細區塊
  const selectedRecords = useMemo(
    () =>
      sortRecordsByLatest(records).filter((record) =>
        dayjs(record.startedAt).isSame(selectedDate, "day")
      ),
    [records, selectedDate]
  );

  const handleMonthChange = (date: dayjs.Dayjs) => {
    setcurrentMonth(date);
  };

  // 用閉包把 highlightedDays 綁進去，就不必透過 slotProps 塞 MUI 型別裡沒有的欄位。
  // identity 只在 highlightedDays 變動（換月或紀錄異動）時才換，那時本來就要重畫日期格子
  const daySlot = useCallback(
    (props: PickerDayProps) => (
      <ServerDay {...props} highlightedDays={highlightedDays} />
    ),
    [highlightedDays]
  );

  return (
    <>
      <DateCalendar
        // 日曆高度固定，不讓它被下方的詳細區塊擠扁
        sx={{ flexShrink: 0 }}
        disableFuture
        value={selectedDate}
        onChange={(date) => date && setSelectedDate(date)}
        onMonthChange={handleMonthChange}
        slots={{
          day: daySlot,
        }}
      />
      {/* 換日期就用 key 重建，展開中的那筆不會殘留到下一天 */}
      <RecordDetailBelowCalendar
        key={selectedDate.format("YYYY-MM-DD")}
        records={selectedRecords}
      />
    </>
  );
}
