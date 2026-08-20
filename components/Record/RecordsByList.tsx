"use client";
import { useState } from "react";
import {
  Container,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { useRecordsStore } from "@/domain/record/store";
import type { Record } from "@/domain/record/schema";
import {
  formatRecordTimeRange,
  getRecordBodyParts,
  groupRecordsByDate,
} from "@/domain/record/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import RecordDetailDialog from "./RecordDetailDialog";

export default function RecordsByList() {
  const records = useRecordsStore((s) => s.records);
  const exercises = useExerciseStore((s) => s.exercises);
  const [selectedId, setSelectedId] = useState<Record["id"] | null>(null);
  const recordGroups = groupRecordsByDate(records);
  // 存 id 而不是整筆：紀錄之後被修改時，開著的 Dialog 也會拿到最新內容
  const selectedRecord = records.find((r) => r.id === selectedId) ?? null;

  if (records.length === 0) {
    return (
      <Container>
        <Typography
          variant="body1"
          color="primary"
          sx={{ textAlign: "center", mt: 5 }}
        >
          尚未有任何訓練紀錄
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <List
        // 外層 layout 是固定 100dvh 且 overflow hidden，清單得自己捲
        sx={{ maxHeight: "60dvh", overflowY: "auto" }}
        subheader={<li />}
      >
        {recordGroups.map((group) => (
          // 巢狀 ul：讓 ListSubheader 捲動時吸附在自己那一組的頂端
          <li key={group.key}>
            <ul style={{ padding: 0 }}>
              <ListSubheader
                // 日期只是標題，不可點；能點的是底下那一行
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: "8px 8px 0 0",
                  lineHeight: 2.5,
                }}
              >
                {group.date}
              </ListSubheader>
              {group.records.map((record, index) => {
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
                      // 同一天的最後一筆才收圓角，整組看起來連成一塊
                      ...(index === group.records.length - 1 && {
                        borderRadius: "0 0 8px 8px",
                        mb: 2,
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
            </ul>
          </li>
        ))}
      </List>
      <RecordDetailDialog
        record={selectedRecord}
        onClose={() => setSelectedId(null)}
      />
    </Container>
  );
}
