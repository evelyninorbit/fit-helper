"use client";

import { useEffect, useState } from "react";
import { List, Button, Stack } from "@mui/material";
import useWorkoutStore, { addLoadSet } from "@/domain/workout/store";
import type { SetRecordWithLoad } from "@/domain/set/schema";
import LoadSetItem from "./LoadSetItem";
import useActiveSetScroll from "../useActiveSetScroll";

type SetWithLoadProps = {
  // entryId = ExerciseRecord.id，每次訓練的一筆動作實例（同動作做兩次也不會撞）
  entryId: string;
};

export default function SetWithLoad({ entryId }: SetWithLoadProps) {
  const sets = (useWorkoutStore(
    (s) => s?.exercise.find((e) => e.id === entryId)?.sets
  ) ?? []) as SetRecordWithLoad[];

  // 只有第一組還沒完成的可以操作，避免第二組還沒紀錄就先做第三組
  const activeIndex = sets.findIndex((s) => !s.startedAt || !s.finishedAt);

  // 組數多到要捲動時，讓進行中的那組自動維持在列表中央
  const listRef = useActiveSetScroll(activeIndex, sets.length);

  // 已結束後被使用者手動解鎖、可再編輯數字的組（不影響 startedAt / finishedAt）
  const [editableSetIds, setEditableSetIds] = useState<Set<string>>(new Set());
  const toggleEditable = (setId: string) =>
    setEditableSetIds((prev) => {
      const next = new Set(prev);
      if (next.has(setId)) next.delete(setId);
      else next.add(setId);
      return next;
    });

  // 進入頁面時，等 persist 還原完成後若這個動作沒有任何組，預設補上第一組
  useEffect(() => {
    const ensureFirstSet = () => {
      const entry = useWorkoutStore
        .getState()
        ?.exercise.find((e) => e.id === entryId);
      if (entry && entry.sets.length === 0) addLoadSet(entryId);
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
        ref={listRef}
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
          <LoadSetItem
            key={set.id}
            entryId={entryId}
            set={set}
            index={index}
            isActive={index === activeIndex}
            editable={editableSetIds.has(set.id)}
            onToggleEditable={toggleEditable}
          />
        ))}
      </List>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginX: 2, marginTop: 4, flexShrink: 0 }}
        onClick={() => addLoadSet(entryId)}
      >
        新增組數
      </Button>
    </Stack>
  );
}