import type {
  Exercise,
  ExerciseByTime,
  ExerciseByWeight,
} from "../exercise/schema";

import type { SetRecordWithLoad, SetRecordWithDuration } from "../set/schema";

/*export type SetBasicRecord = {
  id: string;
  startedAt: string;
  finishedAt: string;
  note: string;
};

export type SetRecordWithLoad = SetBasicRecord & {
  load: number;
  reps: number;
};

export type SetRecordWithDuration = SetBasicRecord & {
  duration: number;
};

export type SetRecord = SetRecordWithLoad | SetRecordWithDuration; */

export type ExerciseBasicRecord = {
  id: string;
  exerciseId: Exercise["id"];
  note: string;
};

export type ExerciseByWeightRecord = ExerciseBasicRecord & {
  exerciseType: ExerciseByWeight["type"];
  sets: SetRecordWithLoad[];
};

export type ExerciseByTimeRecord = ExerciseBasicRecord & {
  exerciseType: ExerciseByTime["type"];
  sets: SetRecordWithDuration[];
};

export type ExerciseRecord = ExerciseByWeightRecord | ExerciseByTimeRecord;

export type Record = {
  id: string;
  startedAt: string;
  finishedAt: string;
  note: string;
  exercise: ExerciseRecord[];
};
