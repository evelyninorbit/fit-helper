"use client";
import { useState } from "react";
import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Record } from "@/domain/record/schema";
import {
  formatRecordDate,
  formatRecordTimeRange,
  getRecordBodyParts,
} from "@/domain/record/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import { formatDuration } from "@/domain/workout/utils";
import FinishWorkoutList from "../FinishWorkout/FinishWorkoutList";

type RecordDetailBelowCalendarProps = {
  // 選中日期當天的紀錄，由新到舊；空陣列代表那天沒有訓練
  records: Record[];
};

// 與 RecordDetailDialog 顯示同樣的內容（時間標示、動作清單、心得），
// 差別是不開 Dialog，直接展開在日曆下方，高度不夠時自己捲
export default function RecordDetailBelowCalendar({
  records,
}: RecordDetailBelowCalendarProps) {
  const exercises = useExerciseStore((s) => s.exercises);
  // 存 id 而不是整筆：紀錄之後被修改時，展開中的內容也會拿到最新的
  const [selectedId, setSelectedId] = useState<Record["id"] | null>(null);

  // 當天只有一筆就不必先選，直接展開詳細內容
  const selectedRecord =
    records.length === 1
      ? records[0]
      : (records.find((r) => r.id === selectedId) ?? null);

  if (records.length === 0) {
    return (
      <Typography
        variant="body2"
        color="primary"
        sx={{ textAlign: "center", mt: 3 }}
      >
        這天沒有訓練紀錄
      </Typography>
    );
  }

  // 一天有多筆而且還沒選：先如 RecordsByList 一樣列出當天各筆訓練
  if (!selectedRecord) {
    return (
      // 外層是 flex column，直接吃掉日曆以下剩的高度，不必自己算 100dvh 扣多少
      <List sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto", pt: 0 }}>
        <Typography
          // 日期只是標題，不可點；能點的是底下那幾行
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: "8px 8px 0 0",
            lineHeight: 2.5,
            px: 2,
          }}
        >
          {formatRecordDate(records[0])}
        </Typography>
        {records.map((record, index) => {
          const bodyParts = getRecordBodyParts(record, exercises);
          return (
            <ListItemButton
              key={record.id}
              onClick={() => setSelectedId(record.id)}
              sx={{
                bgcolor: "secondary.light",
                border: 1,
                borderColor: "divider",
                borderTop: 0,
                // 最後一筆才收圓角，整組看起來連成一塊
                ...(index === records.length - 1 && {
                  borderRadius: "0 0 8px 8px",
                }),
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <ListItemText
                primary={formatRecordTimeRange(record)}
                secondary={`${record.exercise.length} 個動作`}
                slotProps={{
                  secondary: { color: "inherit", sx: { opacity: 0.8 } },
                }}
              />
              {bodyParts.length > 0 && (
                <Typography
                  variant="body2"
                  // 靠右貼齊列尾；部位多時讓它換行，不要把時間那欄擠掉
                  sx={{ ml: 2, textAlign: "right", opacity: 0.8 }}
                >
                  {bodyParts.join("、")}
                </Typography>
              )}
            </ListItemButton>
          );
        })}
      </List>
    );
  }

  const selectedBodyParts = getRecordBodyParts(selectedRecord, exercises);

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
      {/* 只有一筆時沒有清單可以退回，就不顯示返回鍵 */}
      {records.length > 1 && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setSelectedId(null)}
          sx={{ alignSelf: "flex-start" }}
        >
          當日清單
        </Button>
      )}
      <List sx={{ display: "flex", gap: 2, py: 0 }}>
        <ListItemText
          primary="總時長"
          // 舊資料可能沒有 finishedAt，算不出時長就顯示 - 而不是空白
          secondary={
            selectedRecord.finishedAt
              ? formatDuration(
                  selectedRecord.startedAt,
                  selectedRecord.finishedAt,
                )
              : "-"
          }
          sx={{ textAlign: "center" }}
        />
        <ListItemText
          primary="運動部位"
          secondary={
            selectedBodyParts.length > 0 ? selectedBodyParts.join("、") : "-"
          }
          sx={{ textAlign: "center" }}
        />
      </List>

      <Stack sx={{ width: "100%", py: 2 }}>
        <FinishWorkoutList exercises={selectedRecord.exercise} />
        {selectedRecord.note && (
          <Stack sx={{ mt: 5, gap: 1 }}>
            <Typography variant="subtitle2" color="primary">
              本日心得
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // 保留使用者輸入時的換行
                whiteSpace: "pre-wrap",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              {selectedRecord.note}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
