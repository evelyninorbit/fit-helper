"use client";
import { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { EExerciseType, ELoadUnit } from "@/domain/exercise/schema";
import type { ExerciseRecord } from "@/domain/record/schema";
import { formatDuration } from "@/domain/set/utils";

// 重量型與計時型的組數列長得一樣：左邊序號徽章、右邊內容，兩端對齊
const SET_ROW_SX = {
  px: 8,
  py: 2,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

const SET_INDEX_SX = {
  bgcolor: "primary.main",
  borderRadius: 2,
  px: 1,
  color: "primary.contrastText",
};

type FinishExerciseItemProps = {
  record: ExerciseRecord;
  name: string;
  // 重量型動作的單位（kg／lb）；計時型不會用到
  loadUnit: ELoadUnit;
};

export default function FinishExerciseItem({
  record,
  name,
  loadUnit,
}: FinishExerciseItemProps) {
  const [open, setOpen] = useState(false);
  const setCount = record.sets.length;

  return (
    <>
      <ListItemButton
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          py: 1,
          px: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 2,
          // 展開時下緣拉直，與底下的組數清單連成一塊
          ...(open && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
          "&:hover": { bgcolor: "primary.light" },
        }}
      >
        <ListItemText
          primary={name}
          secondary={`${setCount} 組`}
          slotProps={{
            secondary: { color: "inherit", sx: { opacity: 0.8 } },
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          disablePadding
          sx={{
            bgcolor: "secondary.light",
            backgroundOpacity: 2,
            border: 1,
            borderColor: "divider",
            borderTop: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          {setCount === 0 && (
            <ListItemButton disabled sx={{ pl: 4 }}>
              <Typography sx={{ px: 4 }} variant="body2">
                尚未紀錄任何組數
              </Typography>
            </ListItemButton>
          )}
          {record.exerciseType === EExerciseType.WEIGHT
            ? record.sets.map((set, index) => (
                <ListItemButton key={set.id} sx={SET_ROW_SX} disableRipple>
                  <Typography sx={SET_INDEX_SX}>{`${index + 1}`}</Typography>
                  <Typography>{`${set.load} ${loadUnit} × ${set.reps} 次`}</Typography>
                </ListItemButton>
              ))
            : record.sets.map((set, index) => (
                <ListItemButton key={set.id} sx={SET_ROW_SX} disableRipple>
                  <Typography sx={SET_INDEX_SX}>{`${index + 1}`}</Typography>
                  <Typography>{formatDuration(set.duration)}</Typography>
                </ListItemButton>
              ))}
        </List>
      </Collapse>
    </>
  );
}
