import { create } from 'zustand'
import type { Workout } from './schema'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { EExerciseType } from '../exercise/schema'
import type {
  SetBasicRecord,
  SetRecordWithDuration,
  SetRecordWithLoad,
} from '../set/schema'

const defaultSet: SetRecordWithLoad = {
  id: '',
  startedAt: '',
  finishedAt: '',
  note: '',
  load: 0,
  reps: 0,
}

const defaultDurationSet: SetRecordWithDuration = {
  id: '',
  startedAt: '',
  finishedAt: '',
  note: '',
  duration: 0,
}

export type WorkoutStore = Workout | null

const defaultWorkout: Workout = {
  startedAt: '',
  finishedAt: '',
  note: '',
  exercise: [],
}

// immer 讓下方所有操作可以直接 mutate draft；
// 注意：recipe 一律用 bare `return`（不可 `return state`，immer 會報錯）。
const useWorkoutStore = create<WorkoutStore>()(
  persist(
    immer<WorkoutStore>(() => null),
    {
      name: 'workout',
      merge: persistedState => (persistedState as WorkoutStore) ?? defaultWorkout,
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.error('Failed to rehydrate workout store', error)
      },
    },
  ),
)

export default useWorkoutStore

const startWorkout = () => {
  useWorkoutStore.setState({
    ...defaultWorkout,
    startedAt: new Date().toISOString(),
  })
}

const finishWorkout = () => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    state.finishedAt = new Date().toISOString()
  })
}

const resetWorkout = () => {
  useWorkoutStore.setState(defaultWorkout)
}

const resumeWorkout = () => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    state.finishedAt = ''
  })
}

const updateWorkoutNote = (note: string) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    state.note = note
  })
}

const addExerciseToWorkout = (exercise: Workout['exercise'][number]) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    state.exercise.push(exercise)
  })
}

const updateExerciseInWorkout = (
  exerciseId: string,
  updatedExercise: Workout['exercise'][number],
) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const index = state.exercise.findIndex(e => e.id === exerciseId)
    if (index !== -1) state.exercise[index] = updatedExercise
  })
}

const removeExerciseFromWorkout = (exerciseId: string) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const index = state.exercise.findIndex(e => e.id === exerciseId)
    if (index !== -1) state.exercise.splice(index, 1)
  })
}

// 以下針對某一筆動作紀錄（entryId = ExerciseRecord.id，每個實例唯一）操作其 sets。
// 重量型（WEIGHT）用 addLoadSet / updateLoadSet / removeLoadSet；
// 計時型（TIME）用 addDurationSet / updateDurationSet / removeDurationSet。
// 兩種型別的 sets 欄位不同，各自的函式都先用 exerciseType 守門，避免寫錯型別的資料進去。
const addLoadSet = (entryId: string) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.WEIGHT) return
    entry.sets.push({ ...defaultSet, id: crypto.randomUUID() })
  })
}

const updateLoadSet = (
  entryId: string,
  setId: SetRecordWithLoad['id'],
  patch: Partial<Omit<SetRecordWithLoad, 'id'>>,
) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.WEIGHT) return
    const set = entry.sets.find(s => s.id === setId)
    if (set) Object.assign(set, patch)
  })
}

const removeLoadSet = (entryId: string, setId: SetRecordWithLoad['id']) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.WEIGHT) return
    entry.sets = entry.sets.filter(s => s.id !== setId)
  })
}

const addDurationSet = (entryId: string) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.TIME) return
    entry.sets.push({ ...defaultDurationSet, id: crypto.randomUUID() })
  })
}

const updateDurationSet = (
  entryId: string,
  setId: SetRecordWithDuration['id'],
  patch: Partial<Omit<SetRecordWithDuration, 'id'>>,
) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.TIME) return
    const set = entry.sets.find(s => s.id === setId)
    if (set) Object.assign(set, patch)
  })
}

const removeDurationSet = (
  entryId: string,
  setId: SetRecordWithDuration['id'],
) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry || entry.exerciseType !== EExerciseType.TIME) return
    entry.sets = entry.sets.filter(s => s.id !== setId)
  })
}

// 開始／結束時間、筆記等兩種型別共有的欄位；SetActionButton 不需要知道是哪一種組。
const updateSetTiming = (
  entryId: string,
  setId: SetBasicRecord['id'],
  patch: Partial<Omit<SetBasicRecord, 'id'>>,
) => {
  useWorkoutStore.setState(state => {
    if (!state?.startedAt) return
    const entry = state.exercise.find(e => e.id === entryId)
    if (!entry) return
    const set = (entry.sets as SetBasicRecord[]).find(s => s.id === setId)
    if (set) Object.assign(set, patch)
  })
}

export {
  startWorkout,
  finishWorkout,
  resetWorkout,
  resumeWorkout,
  updateWorkoutNote,
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout,
  addLoadSet,
  updateLoadSet,
  removeLoadSet,
  addDurationSet,
  updateDurationSet,
  removeDurationSet,
  updateSetTiming,
}
