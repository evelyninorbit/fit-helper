import type { Category } from '../category/schema'

export type SetRecord = {
  id: string
  load?: number
  reps?: number
  startedAt: string
  finishedAt: string
  note: string
}

export type RestRecord = {
  id: string
  startedAt: string
  finishedAt: string
}

export type Record = {
  id: string
  categoryId: Category['id']
  sets: SetRecord[]
  rests: RestRecord[]
  note: string
}
