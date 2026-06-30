"use client";
import * as React from "react";
import { useState } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  List,
  Container,
  Stack,
  ListItem,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  useExercises,
  updateRestTime,
  useBodyPart,
  useEquipment,
  setBodyPart,
  setEquipment,
  useFilteredExercises,
} from "@/domain/workout/store";

const ALL = "" as const;

export default function SetTimeInterval() {
  const exercises = useExercises();
  const bodyPartId = React.useId();
  const equipmentId = React.useId();

  // 篩選狀態改放在 store，讓其他頁面共享同步
  const bodyPart = useBodyPart();
  const equipment = useEquipment();

  // 部位選項：直接從資料推導出不重複的部位
  const bodyParts = React.useMemo(
    () => Array.from(new Set(exercises.map((e) => e.bodyPart))),
    [exercises]
  );

  // 器材選項：交叉篩選的關鍵——只列出「目前部位」底下有的器材
  const equipments = React.useMemo(() => {
    const pool =
      bodyPart === ALL
        ? exercises
        : exercises.filter((e) => e.bodyPart === bodyPart);
    return Array.from(new Set(pool.map((e) => e.equipment)));
  }, [exercises, bodyPart]);

  // 最終被兩個條件過濾後的動作清單（取自 store）
  const filtered = useFilteredExercises();

  const [content, setContent] = useState<Record<string, string>>(
    Object.fromEntries(exercises.map((e) => [e.id, String(e.restTime)]))
  );

  return (
    <Stack sx={{ alignItems: "center" }}>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id={`${bodyPartId}-label`}>部位</InputLabel>
          <Select
            labelId={`${bodyPartId}-label`}
            id={`${bodyPartId}-select`}
            label="部位"
            value={bodyPart}
            // store 的 setBodyPart 內會自動把器材重設為「全部」
            onChange={(e) => setBodyPart(e.target.value)}
          >
            <MenuItem value={ALL}>
              <em>全部</em>
            </MenuItem>
            {bodyParts.map((part) => (
              <MenuItem key={part} value={part}>
                {part}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id={`${equipmentId}-label`}>器材</InputLabel>
          <Select
            labelId={`${equipmentId}-label`}
            id={`${equipmentId}-select`}
            label="器材"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <MenuItem value={ALL}>
              <em>全部</em>
            </MenuItem>
            {equipments.map((eq) => (
              <MenuItem key={eq} value={eq}>
                {eq}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>

      <List>
        {filtered
          .filter((e) => e.display)
          .map((e) => (
            <Grid
              container
              spacing={2}
              key={e.id}
              sx={{ alignItems: "stretch", my: 2 }} // 等高關鍵
            >
              <Grid size={8}>
                <ListItem
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    bgcolor: "primary.light",
                  }}
                >
                  {e.name}
                </ListItem>
              </Grid>
              <Grid size={3}>
                <TextField
                  value={content[e.id] ?? ""}
                  onChange={(evt) => {
                    const v = evt.target.value;
                    // 只接受純數字（含空字串，讓用戶能清空再輸入）
                    if (v === "" || /^\d+$/.test(v)) {
                      setContent((prev) => ({ ...prev, [e.id]: v }));
                      updateRestTime(e.id, v);
                    }
                  }}
                  fullWidth
                  sx={{
                    height: "100%",
                    "& .MuiInputBase-root": { height: "100%" },
                    "& input": { textAlign: "center" },
                  }}
                ></TextField>
              </Grid>
              <Grid size={1} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>秒</Typography>
              </Grid>
            </Grid>
          ))}
      </List>
    </Stack>
  );
}
