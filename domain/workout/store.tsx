import type { Exercise } from "./schema";
import { useMemo } from "react";
import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// '' 代表「全部」
const ALL = '' as const

export const EXERCISES: Exercise[] = [
    {id: 1,
        name: '啞鈴胸推',
        unitType: 'weight',
        bodyPart: '胸',
        equipment: '啞鈴',
        display: true,
        restTime: '90'},
    {id: 2,
        name: '啞鈴肩推',
        unitType: 'weight',
        bodyPart: '肩',
        equipment: '啞鈴',
        display: true,
        restTime: '90'},
    {id: 3,
        name: '槓鈴胸推',
        unitType: 'weight',
        bodyPart: '胸',
        equipment: '槓鈴',
        display: true,
        restTime: '90'},
    {
        id: 4,
        name: "滑輪下拉",
        unitType: "weight",
        bodyPart: "背",
        equipment: "cable機",
        display: true,
        restTime: '90'
    },
    {
        id: 5,
        name: "直臂下壓",
        unitType: "weight",
        bodyPart: "背",
        equipment: "cable機",
        display: true,
        restTime: '90'
    },
    {
        id: 6,
        name: "腿部外展",
        unitType: "weight",
        bodyPart: "腿",
        equipment: "器械式",
        display: true,
        restTime: '90'
    },
    {
        id: 7,
        name: "腿部內收",
        unitType: "weight",
        bodyPart: "腿",
        equipment: "器械式",
        display: true,
        restTime: '90'
    },
    {
        id: 8,
        name: "臀推",
        unitType: "weight",
        bodyPart: "腿",
        equipment: "器械式",
        display: true,
        restTime: '90'
    },
    {
        id: 9,
        name: "腿推",
        unitType: "weight",
        bodyPart: "腿",
        equipment: "器械式",
        display: true,
        restTime: '90'
    },
    {
        id: 10,
        name: "滑輪三頭下壓",
        unitType: "weight",
        bodyPart: "手臂",
        equipment: "cable機",
        display: false,
        restTime:'90'
    }
]

export type ExerciseStore = {
    exercises: Exercise[]
    bodyPart: string    // 目前選的部位；'' = 全部
    equipment: string   // 目前選的器材；'' = 全部
    restTime: string
}

export const defaultExercises:Exercise[]=[]
export const defaultRestTime = '90'

export const initialExerciseState :ExerciseStore = {
    exercises:defaultExercises,
    bodyPart: ALL,
    equipment: ALL,
    restTime: defaultRestTime
}

export const useExerciseStore = create<ExerciseStore>()(
    persist(
        immer(()=>initialExerciseState),{
            name:'exercises',
            // 只保存動作清單；篩選選擇不存，重整後自動歸零為「全部」
            partialize: (state) => ({ exercises: state.exercises,restTime:state.restTime }),
            onRehydrateStorage: ()=>(state, error)=>{
                if (state && state.exercises.length === 0){
                    state.exercises = EXERCISES
                }
                if (error) {console.error('Failed to rehydrate categories store',error)}
            }
        }

    )
)


export const useExercises = () =>
    useExerciseStore((state) => state.exercises)

export const updateExerciseDisplay = (exerciseId: Exercise['id']) => {
    useExerciseStore.setState(state => {
      const target = state.exercises.find(e => e.id === exerciseId)
      if (target) target.display = !target.display   // immer 讓這種「直接改」安全
    })
  }

export const updateRestTime =(exerciseId:Exercise['id'],restTime:Exercise['restTime'])=>{
    useExerciseStore.setState(state=>{
      const target = state.exercises.find(e => e.id === exerciseId)
        if (target)target.restTime= restTime
    }
        
    )
}

// ── 篩選狀態（跨頁共享）────────────────────────────────
export const useBodyPart = () =>
    useExerciseStore(state => state.bodyPart)

export const useEquipment = () =>
    useExerciseStore(state => state.equipment)

export const setBodyPart = (bodyPart: string) => {
    useExerciseStore.setState(state => {
      state.bodyPart = bodyPart
      state.equipment = ALL   // 換部位時把器材重設為「全部」，避免留下不相容的選擇
    })
  }

export const setEquipment = (equipment: string) => {
    useExerciseStore.setState(state => {
      state.equipment = equipment
    })
  }

// 依目前篩選條件算出的動作清單。用 useMemo 避免每次 render 都產生新陣列
export const useFilteredExercises = () => {
    const exercises = useExercises()
    const bodyPart = useBodyPart()
    const equipment = useEquipment()
    return useMemo(
      () =>
        exercises.filter(
          e =>
            (bodyPart === ALL || e.bodyPart === bodyPart) &&
            (equipment === ALL || e.equipment === equipment),
        ),
      [exercises, bodyPart, equipment],
    )
  }



  