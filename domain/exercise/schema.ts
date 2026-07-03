export type ExerciseBasic = {
  id: number
  name: string
  bodyPart: string
  equipment: string
  display: boolean
  restTime: string
}

export enum EExerciseType {
  WEIGHT = 'weight',
  TIME = 'time',
}

export enum ELoadUnit {
  KG = 'kg',
  LB = 'lb',
}

export type ExerciseByWeight = ExerciseBasic & {
  type: EExerciseType.WEIGHT
  withLoad: true
  loadUnit: ELoadUnit
}

export type ExerciseByTime = ExerciseBasic & {
  type: EExerciseType.TIME
  withLoad: false
}

export type Exercise = ExerciseByWeight | ExerciseByTime
