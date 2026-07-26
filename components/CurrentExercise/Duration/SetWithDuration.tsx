"use client";

import { useEffect } from "react";
import { List, Button, Stack } from "@mui/material";
import useWorkoutStore, {
  addDurationSet,
  removeDurationSet,
} from "@/domain/workout/store";
import type { SetRecordWithDuration } from "@/domain/set/schema";
import DurationSetItem from "./DurationSetItem";

type SetWithDurationProps = {
  // entryId = ExerciseRecord.id，每次訓練的一筆動作實例（同動作做兩次也不會撞）
  entryId: string;
};

export default function SetWithDuration({ entryId }: SetWithDurationProps) {
  const sets = (useWorkoutStore(
    (s) => s?.exercise.find((e) => e.id === entryId)?.sets
  ) ?? []) as SetRecordWithDuration[];

  // 進入頁面時，等 persist 還原完成後若這個動作沒有任何組，預設補上第一組
  useEffect(() => {
    const ensureFirstSet = () => {
      const entry = useWorkoutStore
        .getState()
        ?.exercise.find((e) => e.id === entryId);
      if (entry && entry.sets.length === 0) addDurationSet(entryId);
    };
    if (useWorkoutStore.persist.hasHydrated()) {
      ensureFirstSet();
      return;
    }
    return useWorkoutStore.persist.onFinishHydration(ensureFirstSet);
  }, [entryId]);


  return (
    <Stack sx={{ width: "100%", flex: 1, minHeight: 0 }}>
      <List
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {sets.map((set, index) => (
          <DurationSetItem
            key={set.id}
            entryId={entryId}
            set={set}
            index={index}
            onRemove={() => removeDurationSet(entryId, set.id)}
          />
        ))}
      </List>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginX: 2, marginTop: 4, flexShrink: 0 }}
        onClick={() => addDurationSet(entryId)}
      >
        新增組數
      </Button>
    </Stack>
  );
}