"use client";
import * as React from "react";
import { List, ListItem, Button, ListItemText } from "@mui/material";
import { useExerciseStore } from "@/domain/exercise/store";
import { Exercise } from "@/domain/exercise/schema";

type SettingExerciseDisplayProps = {
  filtered: Exercise[];
};

export default function SettingExerciseDisplay({
  filtered,
}: SettingExerciseDisplayProps) {
  const toggleExerciseDisplay = (exerciseId: Exercise["id"]) => {
    useExerciseStore.setState((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === exerciseId ? { ...e, display: !e.display } : e
      ),
    }));
  };
  return (
    <>
      <List disablePadding>
        {filtered.map((e) => (
          <ListItem key={e.id} disableGutters>
            <Button
              fullWidth
              variant={e.display ? "contained" : "outlined"}
              onClick={() => toggleExerciseDisplay(e.id)}
              sx={{
                borderRadius: 2,
              }}
            >
              <ListItemText primary={e.name} />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
}
