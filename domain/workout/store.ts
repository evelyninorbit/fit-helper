import { create } from 'zustand'
import type { Workout } from './schema'
import { persist } from 'zustand/middleware'

export type WorkoutStore = Workout | null

const defaultWorkout: Workout = {
  startedAt: '',
  finishedAt: '',
  note: '',
  exercise: [],
}

const useWorkoutStore = create<WorkoutStore>()(
  persist<WorkoutStore>(() => null, {
    name: 'workout',
    onRehydrateStorage: () => (state, error) => {
      if (state === null) return defaultWorkout
      if (error) console.error('Failed to rehydrate categories store', error)
    },
  }),
)

export default useWorkoutStore

const startWorkout = () => {
  useWorkoutStore.setState({
    ...defaultWorkout,
    startedAt: new Date().toISOString(),
  })
}

// const finishWorkout = () => {
//   useWorkoutStore.setState(prev => {
//     if (!prev?.startedAt) return prev
//     return {
//       finishedAt: new Date().toISOString(),
//     }
//   })
// }

const resetWorkout = () => {
  useWorkoutStore.setState(defaultWorkout)
}

const updateWorkoutNote = (note: string) => {
  useWorkoutStore.setState(prev => {
    if (!prev?.startedAt) return prev
    return {
      note,
    }
  })
}

const addExerciseToWorkout = (exercise: Workout['exercise'][number]) => {
  useWorkoutStore.setState(prev => {
    if (!prev?.startedAt) return prev
    return {
      exercise: [...prev.exercise, exercise],
    }
  })
}

const updateExerciseInWorkout = (
  exerciseId: string,
  updatedExercise: Workout['exercise'][number],
) => {
  useWorkoutStore.setState(prev => {
    if (!prev?.startedAt) return prev
    const updatedExercises = prev.exercise.map(exercise =>
      exercise.id === exerciseId ? updatedExercise : exercise,
    )
    return {
      exercise: updatedExercises,
    }
  })
}

const removeExerciseFromWorkout = (exerciseId: string) => {
  useWorkoutStore.setState(prev => {
    if (!prev?.startedAt) return prev
    const updatedExercises = prev.exercise.filter(
      exercise => exercise.id !== exerciseId,
    )
    return {
      exercise: updatedExercises,
    }
  })
}

export {
  startWorkout,
  resetWorkout,
  updateWorkoutNote,
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout,
}
