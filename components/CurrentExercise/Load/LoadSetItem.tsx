"use client";

import { Grid, Typography, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateLoadSet, removeLoadSet } from "@/domain/workout/store";
import type { SetRecordWithLoad } from "@/domain/set/schema";
import LoadSetActionButton from "./LoadSetActionButton";

// 兩個按鈕共用的樣式
const iconButtonSx = {
  padding: 1,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "#ffffff",
  "&:hover": { bgcolor: "primary.light" },
  "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
};

type LoadSetItemProps = {
  entryId: string;
  set: SetRecordWithLoad;
  // 顯示用的組次序（第幾組）
  index: number;
  // 該組是否已被使用者手動解鎖可編輯（結束後）
  editable: boolean;
  onToggleEditable: (setId: string) => void;
};

export default function LoadSetItem({
  entryId,
  set,
  index,
  editable,
  onToggleEditable,
}: LoadSetItemProps) {
  // 已開始且未被解鎖的組鎖定輸入
  const locked = !!set.startedAt && !editable;
  // 防呆：kg 或次數為空（值為 0 時顯示空白）就不能開始該組
  const startDisabled = !set.startedAt && (set.load === 0 || set.reps === 0);

  return (
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      <Grid size={2}>
        <Typography sx={{ padding: 2, borderRadius: 2 }}>
          {index + 1}
        </Typography>
      </Grid>
      <Grid size={3}>
        <TextField
          label="kg"
          variant="outlined"
          type="number"
          disabled={locked}
          value={set.load === 0 ? "" : set.load}
          onChange={(e) =>
            updateLoadSet(entryId, set.id, {
              load: Math.max(0, Number(e.target.value)),
            })
          }
          slotProps={{
            htmlInput: {
              min: 0,
              step: 5,
            },
          }}
        />
      </Grid>
      <Grid size={3}>
        <TextField
          label="次數"
          variant="outlined"
          type="number"
          disabled={locked}
          value={set.reps === 0 ? "" : set.reps}
          onChange={(e) =>
            updateLoadSet(entryId, set.id, {
              reps: Math.max(0, Number(e.target.value)),
            })
          }
          slotProps={{
            htmlInput: {
              min: 0,
            },
          }}
        />
      </Grid>
      <Grid size={2}>
        <LoadSetActionButton
          entryId={entryId}
          set={set}
          editable={editable}
          onToggleEditable={onToggleEditable}
          sx={iconButtonSx}
          disabled={startDisabled}
        />
      </Grid>
      <Grid size={2}>
        <IconButton
          sx={iconButtonSx}
          onClick={() => removeLoadSet(entryId, set.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
      <Grid size={12} sx={{ paddingX: 4 }}>
        <TextField
          label="該組筆記"
          variant="outlined"
          multiline
          maxRows={5}
          fullWidth
          value={set.note}
          onChange={(e) =>
            updateLoadSet(entryId, set.id, { note: e.target.value })
          }
        />
      </Grid>
    </Grid>
  );
}
