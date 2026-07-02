import type { Record } from '../record/schema'

// 當前運動狀態紀錄
export type Workout = Omit<Record, 'id'>
