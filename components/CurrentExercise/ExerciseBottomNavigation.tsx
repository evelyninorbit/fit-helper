"use client";

import { Delete as DeleteIcon } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  BottomNavigation,
  BottomNavigationAction,
  bottomNavigationActionClasses,
  IconButton,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import useWorkoutStore, {
  removeExerciseFromWorkout,
} from "@/domain/workout/store";

export default function ExerciseBottomNavigation() {
  const router = useRouter();
  // eid = ExerciseRecord.id（動作實例 UUID）
  const eid = useSearchParams().get("eid");
  const workoutExercises = useWorkoutStore((s) => s?.exercise) ?? [];

  const currentIndex = workoutExercises.findIndex(
    (record) => record.id === eid
  );
  const currentRecord = workoutExercises[currentIndex];
  const prevRecord =
    currentIndex > 0 ? workoutExercises[currentIndex - 1] : undefined;
  const nextRecord = workoutExercises[currentIndex + 1];

  // 待刪除的動作 id：按下刪除鍵時先記下，等本頁卸載後才真的從 store 移除。
  // 若在此頁還沒卸載時就改 store，本頁會先 re-render 成空白（entry 變 undefined）
  // 才跳轉，造成一閃而過的空畫面。延到卸載才刪除即可完全避免。
  const pendingDeleteId = useRef<string | null>(null);
  useEffect(
    () => () => {
      if (pendingDeleteId.current) {
        removeExerciseFromWorkout(pendingDeleteId.current);
        pendingDeleteId.current = null;
      }
    },
    []
  );

  // 從 ExerciseList 刪除當前動作，並回到 ExerciseList
  const handleDelete = () => {
    if (!currentRecord) return;
    pendingDeleteId.current = currentRecord.id;
    router.push("/");
  };

  // 回到 ExerciseList（首頁），不動任何資料
  const handleBackToList = () => {
    router.push("/");
  };

  // 回到前一個動作的 current-exercise 頁面（透過 eid 改變）；
  // 沒有前一個動作時回到動作列表
  const handlePrev = () => {
    if (prevRecord) {
      router.push(`/current-exercise?eid=${prevRecord.id}`);
    } else {
      router.push("/");
    }
  };

  // 前往下一個動作的 current-exercise 頁面（透過 eid 改變）；
  // 沒有下一個動作時回到動作列表
  const handleNext = () => {
    if (nextRecord) {
      router.push(`/current-exercise?eid=${nextRecord.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <BottomNavigation
      showLabels
      sx={{
        width: "100%",
        bgcolor: "primary.main",
        [`.${bottomNavigationActionClasses.root}`]: {
          color: "primary.contrastText",
        },
        position: "absolute",
        bottom: 0,
      }}
    >
      <BottomNavigationAction
        disableRipple
        onClick={handlePrev}
        icon={
          <IconButton component="span" color="inherit">
            <ArrowBackIosNewIcon />
          </IconButton>
        }
        sx={{ cursor: "pointer" }}
      />
      <BottomNavigationAction
        disableRipple
        onClick={handleBackToList}
        icon={
          <IconButton component="span" color="inherit">
            <FormatListBulletedIcon />
          </IconButton>
        }
        sx={{ cursor: "pointer", color: "inherit" }}
      />
      <BottomNavigationAction
        disableRipple
        onClick={handleDelete}
        icon={
          <IconButton component="span" color="inherit">
            <DeleteIcon />
          </IconButton>
        }
        sx={{ cursor: "pointer", color: "inherit" }}
      />
      <BottomNavigationAction
        disableRipple
        onClick={handleNext}
        icon={
          <IconButton component="span" color="inherit">
            <ArrowForwardIosIcon />
          </IconButton>
        }
        sx={{ cursor: "pointer" }}
      />
    </BottomNavigation>
  );
}
