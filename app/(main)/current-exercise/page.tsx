"use client";

import { useExerciseStore } from "@/domain/exercise/store";
import useWorkoutStore from "@/domain/workout/store";
import { useSearchParams } from "next/navigation";
import ExerciseTitle from "@/components/CurrentExercise/ExerciseTitle";
import { Container, Stack } from "@mui/material";
import SetWithLoad from "@/components/CurrentExercise/Load/SetWithLoad";
import SetWithDuration from "@/components/CurrentExercise/Duration/SetWithDuration";
import ExerciseBottomNavigation from "@/components/CurrentExercise/ExerciseBottomNavigation";
import { EExerciseType } from "@/domain/exercise/schema";

export default function Exercise() {
  // eid = ExerciseRecord.id（workout 內的動作實例，UUID），不是動作定義 id
  const entryId = useSearchParams().get("eid");
  const entry = useWorkoutStore((s) =>
    s?.exercise.find((e) => e.id === entryId)
  );
  const currentExercise = useExerciseStore((e) => e.exercises).find(
    (e) => e.id === entry?.exerciseId
  );
  return (
    <Container maxWidth="sm">
      <Stack sx={{ alignItems: "center", height: "100dvh", paddingBottom: 10 }}>
        <ExerciseTitle currentExercise={currentExercise} />
        {entry &&
          (entry.exerciseType === EExerciseType.TIME ? (
            <SetWithDuration entryId={entry.id} />
          ) : (
            <SetWithLoad entryId={entry.id} />
          ))}
        <ExerciseBottomNavigation />
      </Stack>
    </Container>
  );
}
