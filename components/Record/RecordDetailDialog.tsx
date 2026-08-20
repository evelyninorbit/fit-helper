"use client";
import {
  Container,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Record } from "@/domain/record/schema";
import FinishTimeMark from "../FinishWorkout/FinishTimeMark";
import FinishWorkoutList from "../FinishWorkout/FinishWorkoutList";

type RecordDetailDialogProps = {
  // null 代表沒有選中任何一筆紀錄，Dialog 關閉
  record: Record | null;
  onClose: () => void;
};

// 已儲存的紀錄是唯讀的：沿用完成畫面的時間標示與動作清單，
// 但不放「返回／儲存」按鈕，心得也只顯示不編輯
export default function RecordDetailDialog({
  record,
  onClose,
}: RecordDetailDialogProps) {
  return (
    <Dialog
      fullScreen
      open={!!record}
      onClose={onClose}
      sx={{ bgcolor: "secondary.main" }}
    >
      {record && (
        <Container
          maxWidth="sm"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            pb: 3,
            bgcolor: "secondary.main",
          }}
        >
          <IconButton
            aria-label="關閉"
            onClick={onClose}
            sx={{ alignSelf: "flex-end", mt: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <FinishTimeMark
            startedAt={record.startedAt}
            finishedAt={record.finishedAt}
          />
          <Stack
            sx={{
              width: "100%",
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              py: 2,
            }}
          >
            <FinishWorkoutList exercises={record.exercise} />
            {record.note && (
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
                  {record.note}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Container>
      )}
    </Dialog>
  );
}
