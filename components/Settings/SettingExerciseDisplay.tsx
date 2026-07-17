"use client";
import * as React from "react";
import { List, ListItem, ListItemButton, ListItemText,Container } from "@mui/material";
import { useExerciseStore } from "@/domain/exercise/store";
import { Exercise } from "@/domain/exercise/schema";

type SettingExerciseDisplayProps = {
  filtered: Exercise[]
}

export default function SettingExerciseDisplay({filtered}:SettingExerciseDisplayProps) {
  const toggleExerciseDisplay = (exerciseId: Exercise["id"]) => {
    useExerciseStore.setState((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === exerciseId ? { ...e, display: !e.display } : e
      ),
    }));
  }
  return (
    <>
    <List disablePadding>
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
      </List>
      
    </>
  );
}
