import { persist } from 'zustand/middleware'
import { Record } from './schema'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type RecordsStore = {
  records: Record[]
}

const defaultRecords: Record[] = []

const initialRecordsState: RecordsStore = {
  records: defaultRecords,
}

export const useRecordsStore = create<RecordsStore>()(
  persist(
    immer(() => initialRecordsState),
    { name: 'records' },
  ),
)

export const addRecord = (record: Record) => {
  useRecordsStore.setState(state => {
    state.records.unshift(record)
  })
}

export const updateRecord = (
  recordId: Record['id'],
  updatedRecord: Partial<Record>,
) => {
  useRecordsStore.setState(state => {
    const index = state.records.findIndex(record => record.id === recordId)
    if (index === -1) return
    state.records[index] = { ...state.records[index], ...updatedRecord }
  })
}

export const updateSetInRecords = (
  recordId: Record['id'],
  setId: Record['sets'][number]['id'],
  updatedSet: Partial<Record['sets'][number]>,
) => {
  useRecordsStore.setState(state => {
    const recordIndex = state.records.findIndex(r => r.id === recordId)
    if (recordIndex === -1) return

    const record = state.records[recordIndex]
    const setIndex = record.sets.findIndex(s => s.id === setId)
    if (setIndex === -1) return

    state.records[recordIndex].sets[setIndex] = {
      ...record.sets[setIndex],
      ...updatedSet,
    }
  })
}

export const updateRestInRecords = (
  recordId: Record['id'],
  restId: Record['rests'][number]['id'],
  updatedRest: Partial<Record['rests'][number]>,
) => {
  useRecordsStore.setState(state => {
    const recordIndex = state.records.findIndex(r => r.id === recordId)
    if (recordIndex === -1) return

    const record = state.records[recordIndex]
    const restIndex = record.rests.findIndex(r => r.id === restId)
    if (restIndex === -1) return

    state.records[recordIndex].rests[restIndex] = {
      ...record.rests[restIndex],
      ...updatedRest,
    }
  })
}

export const removeRecord = (recordId: Record['id']) => {
  useRecordsStore.setState(state => {
    const index = state.records.findIndex(record => record.id === recordId)
    if (index === -1) return
    state.records.splice(index, 1)
  })
}
