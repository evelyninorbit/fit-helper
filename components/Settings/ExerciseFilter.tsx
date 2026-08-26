"use client";
import * as React from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
} from "@mui/material";
import { useExerciseStore } from "@/domain/exercise/store";

type ExerciseFilterProps = {
  bodyPart: string;
  setBodyPart: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
};

export default function ExerciseFilter({
  bodyPart,
  setBodyPart,
  equipment,
  setEquipment,
}: ExerciseFilterProps) {
  const exercises = useExerciseStore((s) => s.exercises);
  const bodyPartId = React.useId();
  const equipmentId = React.useId();

  return (
    <>
      <Stack direction="row" spacing={1}>
        <FormControl fullWidth>
          <InputLabel id={`${bodyPartId}-label`}>部位</InputLabel>
          <Select
            labelId={`${bodyPartId}-label`}
            id={`${bodyPartId}-select`}
            label="部位"
            value={bodyPart}
            // store 的 setBodyPart 內會自動把器材重設為「全部」
            onChange={(e) => setBodyPart(e.target.value)}
          >
            <MenuItem value="">
              <em>全部</em>
            </MenuItem>
            {Array.from(new Set(exercises.map((e) => e.bodyPart))).map(
              (part) => (
                <MenuItem key={part} value={part}>
                  {part}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id={`${equipmentId}-label`}>器材</InputLabel>
          <Select
            labelId={`${equipmentId}-label`}
            id={`${equipmentId}-select`}
            label="器材"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <MenuItem value="">
              <em>全部</em>
            </MenuItem>
            {Array.from(new Set(exercises.map((e) => e.equipment))).map(
              (eq) => (
                <MenuItem key={eq} value={eq}>
                  {eq}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

/* const toggleExerciseDisplay = (exerciseId: Exercise["id"]) => {
      useExerciseStore.setState((state) => ({
        exercises: state.exercises.map((e) =>
          e.id === exerciseId ? { ...e, display: !e.display } : e
        ),
      }));
    };
<List>
    {filtered.map((e) => (
      <ListItem key={e.id} disableGutters>
        <ListItemButton
          selected={e.display}
          onClick={() => toggleExerciseDisplay(e.id)}
          sx={{
            borderRadius: 2,
            "&.Mui-selected": { bgcolor: "primary.light" },
          }}
        >
          <ListItemText primary={e.name} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>*/

/*const [bodyPart, setBodyPart] = React.useState<string>("");
  const [equipment, setEquipment] = React.useState<string>("");

  const filtered = exercises.filter(
    (e) =>
      (!bodyPart || bodyPart === e.bodyPart) &&
      (!equipment || equipment === e.equipment)*/
