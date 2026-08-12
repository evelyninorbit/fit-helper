"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

type LoadSetNoteDialogProps = {
  open: boolean;
  onClose: () => void;
  // 顯示用的組次序（第幾組）
  index: number;
  note: string;
  onNoteChange: (note: string) => void;
};

export default function SetNoteDialog({
  open,
  onClose,
  index,
  note,
  onNoteChange,
}: LoadSetNoteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { bgcolor: "secondary.main" } } }}
    >
      <DialogTitle>{`第 ${index + 1} 組筆記`}</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          multiline
          minRows={4}
          maxRows={10}
          fullWidth
          autoFocus
          placeholder="記錄這組的感受、姿勢調整…"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>完成</Button>
      </DialogActions>
    </Dialog>
  );
}
