import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import RestCountDown from "./RestCountdown";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  // 固定高度：筆記輸入變多行時 dialog 也不會跟著長高
  "& .MuiDialog-paper": {
    borderRadius: 10,
    width: "80%",
    height: "80%",
    maxHeight: "100vh",
  },

  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type RestBetweenSetsProps = {
  // 由外部（按下停止的那一組）控制開關
  open: boolean;
  // 這個動作設定的休息秒數
  seconds: number;
  onClose: () => void;
  // 剛做完那一組的筆記
  note: string;
  onNoteChange: (note: string) => void;
};

export default function RestBetweenSets({
  open,
  seconds,
  onClose,
  note,
  onNoteChange,
}: RestBetweenSetsProps) {
  return (
    <BootstrapDialog
      // 休息中誤觸背景不關閉，只能按下方按鈕結束
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      aria-labelledby="rest-between-sets-title"
      open={open}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <RestCountDown
          seconds={seconds}
          onFinish={onClose}
          note={note}
          onNoteChange={onNoteChange}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: "background.default" }}>
        <Button autoFocus onClick={onClose}>
          結束休息
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
