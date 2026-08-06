import type { Exercise } from "./schema";

const getExerciseName = (exerciseId: Exercise["id"], exercises: Exercise[]) => {
  return exercises.find((e) => e.id === exerciseId)?.name ?? "未知動作";
};

const currentExercise = (exerciseId: Exercise["id"], exercises: Exercise[]) => {
  return exercises.find((e) => e.id === exerciseId);
};
export { getExerciseName, currentExercise };
