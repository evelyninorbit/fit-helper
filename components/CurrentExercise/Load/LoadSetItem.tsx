"use client";

import { useState } from "react";
import { Grid, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateLoadSet, removeLoadSet } from "@/domain/workout/store";
import type { SetRecordWithLoad } from "@/domain/set/schema";
import SetItemCard from "../SetItemCard";
import SetIndexBadge from "../SetIndexBadge";
import LoadSetActionButton from "./LoadSetActionButton";
import SetNoteDialog from "../SetNoteDialog";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatIcon from "@mui/icons-material/Chat";

// 兩個按鈕共用的樣式
const iconButtonSx = {
  padding: 1,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "#ffffff",
  "&:hover": { bgcolor: "primary.light" },
  // 唯讀：保留原本配色但降透明度，游標改回一般箭頭，暗示現在按了沒作用
  '&[aria-disabled="true"]': {
    opacity: 0.5,
    cursor: "default",
    // 蓋掉上面的 hover 變色（屬性選擇器權重較高，會贏過 &:hover）
    "&:hover": { bgcolor: "primary.main" },
  },
};

type LoadSetItemProps = {
  entryId: string;
  set: SetRecordWithLoad;
  // 顯示用的組次序（第幾組）
  index: number;
  // 是否為目前唯一可操作的組（第一組尚未完成的）
  isActive: boolean;
  // 該組是否已被使用者手動解鎖可編輯（結束後）
  editable: boolean;
  onToggleEditable: (setId: string) => void;
};

export default function LoadSetItem({
  entryId,
  set,
  index,
  isActive,
  editable,
  onToggleEditable,
}: LoadSetItemProps) {
  // 該組筆記的 dialog 是否開啟
  const [noteOpen, setNoteOpen] = useState(false);
  // 這一組已經做完
  const finished = !!set.startedAt && !!set.finishedAt;
  // 已開始、或還輪不到的組都鎖定輸入；手動解鎖後才放行
  const locked = !editable && (!!set.startedAt || !isActive);
  // 防呆：kg 或次數為空（值為 0 時顯示空白）就不能開始該組
  const startDisabled = !set.startedAt && (set.load === 0 || set.reps === 0);
  // 已完成的組保留編輯鍵；未完成但還輪不到的組不能開始
  const actionDisabled = finished ? false : !isActive || startDisabled;
  // 該組是否已有筆記（只有空白字元不算）
  const hasNote = set.note.trim() !== "";

  return (
    <>
      <SetItemCard isActive={isActive} finished={finished}>
        <Grid
          container
          spacing={4}
          sx={{ alignItems: "center" }}
          rowSpacing={2.5}
        >
          <Grid size={2}>
            <SetIndexBadge
              index={index}
              isActive={isActive}
              finished={finished}
            />
          </Grid>
          <Grid size={5}>
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
          <Grid size={5}>
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
          <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
            <LoadSetActionButton
              entryId={entryId}
              set={set}
              editable={editable}
              onToggleEditable={onToggleEditable}
              sx={iconButtonSx}
              disabled={actionDisabled}
            />
          </Grid>
          <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              sx={iconButtonSx}
              // 還沒開始的組不能寫筆記，避免跳著幫後面的組留紀錄
              onClick={() => set.startedAt && setNoteOpen(true)}
              aria-disabled={!set.startedAt}
              disableRipple={!set.startedAt}
            >
              {hasNote ? <ChatIcon /> : <ChatBubbleIcon />}
            </IconButton>
          </Grid>
          <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              sx={iconButtonSx}
              onClick={() => removeLoadSet(entryId, set.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </SetItemCard>
      <SetNoteDialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        index={index}
        note={set.note}
        onNoteChange={(note) => updateLoadSet(entryId, set.id, { note })}
      />
    </>
  );
}
