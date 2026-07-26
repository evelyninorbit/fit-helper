import type { Exercise } from "./schema";
import { EExerciseType, ELoadUnit } from "./schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const EXERCISES: Exercise[] = [
  {
    id: 1,
    name: "啞鈴胸推",
    bodyPart: "胸",
    equipment: "啞鈴",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 2,
    name: "啞鈴肩推",
    bodyPart: "肩",
    equipment: "啞鈴",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 3,
    name: "槓鈴胸推",
    bodyPart: "胸",
    equipment: "槓鈴",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 4,
    name: "滑輪下拉",
    bodyPart: "背",
    equipment: "cable機",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 5,
    name: "直臂下壓",
    bodyPart: "背",
    equipment: "cable機",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 6,
    name: "腿部外展",
    bodyPart: "腿",
    equipment: "器械式",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 7,
    name: "腿部內收",
    bodyPart: "腿",
    equipment: "器械式",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 8,
    name: "臀推",
    bodyPart: "腿",
    equipment: "器械式",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 9,
    name: "腿推",
    bodyPart: "腿",
    equipment: "器械式",
    display: true,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 10,
    name: "滑輪三頭下壓",
    bodyPart: "手臂",
    equipment: "cable機",
    display: false,
    restTime: 90,
    type: EExerciseType.WEIGHT,
    withLoad: true,
    loadUnit: ELoadUnit.KG,
  },
  {
    id: 11,
    name: "跑步機",
    bodyPart: "有氧",
    equipment: "器械",
    display: true,
    restTime: 90,
    type: EExerciseType.TIME,
    withLoad: false,
  },
];

export type ExerciseStore = {
  exercises: Exercise[];
};

export const defaultExercises: Exercise[] = [];
export const defaultRestTime = 90;

export const initialExerciseState: ExerciseStore = {
  exercises: defaultExercises,
};

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    immer(() => initialExerciseState),
    {
      name: "exercises",
      // 只保存動作清單；篩選選擇不存，重整後自動歸零為「全部」
      partialize: (state) => ({
        exercises: state.exercises,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state && state.exercises.length === 0) {
          state.exercises = EXERCISES;
        }
        if (error) {
          console.error("Failed to rehydrate categories store", error);
        }
      },
    }
  )
);

export const useExercises = () => useExerciseStore((state) => state.exercises);

export const updateExerciseDisplay = (exerciseId: Exercise["id"]) => {
  useExerciseStore.setState((state) => {
    const target = state.exercises.find((e) => e.id === exerciseId);
    if (target) target.display = !target.display; // immer 讓這種「直接改」安全
  });
};

export const updateRestTime = (
  exerciseId: Exercise["id"],
  restTime: Exercise["restTime"]
) => {
  useExerciseStore.setState((state) => {
    const target = state.exercises.find((e) => e.id === exerciseId);
    if (target) target.restTime = restTime;
  });
};
