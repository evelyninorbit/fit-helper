"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

type FinishSavedDialogProps = {
  open: boolean;
  // 按下確定才真的清掉 workout，回到未開始運動的首頁
  onConfirm: () => void;
};

export default function FinishSavedDialog({
  open,
  onConfirm,
}: FinishSavedDialogProps) {
  return (
    <Dialog
      open={open}
      // MUI 9 的 Modal 只有在有 onClose 時才會回應背景點擊與 Esc；
      // 這裡刻意不給，只留「確定」一條路（v9 已無 disableEscapeKeyDown）
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { sx: { bgcolor: "secondary.main", borderRadius: 2 } },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>太棒啦！</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          已完成本次運動
          <br />
          給自己一個大大的鼓勵吧！
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          autoFocus
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
