import type {
  Exercise,
  ExerciseByTime,
  ExerciseByWeight,
} from '../exercise/schema'

export type SetBasicRecord = {
  id: string
  startedAt: string
  finishedAt: string
  note: string
}

export type SetRecordWithLoad = SetBasicRecord & {
  load: number
  reps: number
}

export type SetRecordWithoutLoad = SetBasicRecord

export type SetRecord = SetRecordWithLoad | SetRecordWithoutLoad

// deprecated
export type RestRecord = {
  id: string
  startedAt: string
  finishedAt: string
}

export type ExerciseBasicRecord = {
  id: string
  exerciseId: Exercise['id']
  note: string
}

export type ExerciseByWeightRecord = ExerciseBasicRecord & {
  exerciseType: ExerciseByWeight['type']
  sets: SetRecordWithLoad[]
}

export type ExerciseByTimeRecord = ExerciseBasicRecord & {
  exerciseType: ExerciseByTime['type']
  sets: SetRecordWithoutLoad[]
}

export type ExerciseRecord = ExerciseByWeightRecord | ExerciseByTimeRecord

export type Record = {
  id: string
  startedAt: string
  finishedAt: string
  note: string
  exercise: ExerciseRecord[]
}
