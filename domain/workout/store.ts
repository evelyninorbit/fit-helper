import type { Exercise } from "./schema";
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

const EXERCISES: Exercise[] = [
    {id: 1,
        name: '啞鈴胸推',
        unit: '重量',
        bodyPart: '胸',
        equipment: '啞鈴',
        display: true,
        restTime: 90},
    {id: 2,
        name: '啞鈴肩推',
        unit: '重量',
        bodyPart: '肩',
        equipment: '啞鈴',
        display: true,
        restTime: 90},
    {id: 3,
        name: '槓鈴胸推',
        unit: '重量',
        bodyPart: '胸',
        equipment: '槓鈴',
        display: true,
        restTime: 90}
]

export type ExerciseStore = {
    exercises: Exercise[]
}

export const defaultExercises:Exercise[]=[]

export const initialExerciseState :ExerciseStore = {
    exercises:defaultExercises
}

const useExerciseStore = create<ExerciseStore>()(
    persist(
        immer(()=>initialExerciseState),{
            name:"exercises",
            onRehydrateStorage: () => (state, error) => {
                if (state && state.exercises.length === 0)
                  state.exercises = EXERCISES
        
                if (error) console.error('Failed to rehydrate categories store', error)
              },
        }
    )
)

export const addExercise = (exercise: Exercise)=>{
    useExerciseStore.setState((state)=>state.exercises.push(exercise))
}

