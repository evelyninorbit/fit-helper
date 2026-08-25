"use client";
import { useId, useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useRecordsStore } from "@/domain/record/store";
import type { Record } from "@/domain/record/schema";
import {
  MONTH_OPTIONS,
  filterRecordsByYearMonth,
  formatRecordTimeRange,
  getCurrentMonth,
  getCurrentYear,
  getRecordBodyParts,
  getRecordYears,
  groupRecordsByDate,
} from "@/domain/record/utils";
import { useExerciseStore } from "@/domain/exercise/store";
import RecordDetailDialog from "./RecordDetailDialog";

export default function RecordsByList() {
  const records = useRecordsStore((s) => s.records);
  const exercises = useExerciseStore((s) => s.exercises);
  const [selectedId, setSelectedId] = useState<Record["id"] | null>(null);
  // 預設停在本年本月；"" = 全部
  const [year, setYear] = useState<number | "">(() => getCurrentYear());
  const [month, setMonth] = useState<number | "">(() => getCurrentMonth());
  const yearId = useId();
  const monthId = useId();
  const yearOptions = getRecordYears(records);
  const filteredRecords = filterRecordsByYearMonth(records, year, month);
  const recordGroups = groupRecordsByDate(filteredRecords);
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
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexShrink: 0 }}>
        <FormControl fullWidth size="small">
          <InputLabel id={`${yearId}-label`}>年</InputLabel>
          <Select<number | "">
            labelId={`${yearId}-label`}
            id={`${yearId}-select`}
            label="年"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value="">
              <em>全部</em>
            </MenuItem>
            {yearOptions.map((y) => (
              <MenuItem key={y} value={y}>
                {y} 年
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" disabled={year === ""}>
          <InputLabel id={`${monthId}-label`}>月</InputLabel>
          <Select<number | "">
            labelId={`${monthId}-label`}
            id={`${monthId}-select`}
            label="月"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <MenuItem value="">
              <em>全部</em>
            </MenuItem>
            {MONTH_OPTIONS.map((m) => (
              <MenuItem key={m} value={m}>
                {m} 月
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {filteredRecords.length === 0 ? (
        <Typography
          variant="body1"
          color="primary"
          sx={{ textAlign: "center", mt: 5 }}
        >
          這段期間沒有訓練紀錄
        </Typography>
      ) : (
        <List
          // 外層 layout 是固定 100dvh 且 overflow hidden，清單得自己捲。
          // 高度不寫死，直接吃掉篩選器以下的剩餘空間
          sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}
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
      )}
      <RecordDetailDialog
        record={selectedRecord}
        onClose={() => setSelectedId(null)}
      />
    </Container>
  );
}
