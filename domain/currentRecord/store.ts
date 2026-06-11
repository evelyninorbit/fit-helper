import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Record, RestRecord, SetRecord } from '../record/schema'
import { addRecord } from '../record/store'
import { immer } from 'zustand/middleware/immer'

export type CurrentRecordStore = {
  currentRecord: Record | null
}

const initialCurrentRecordState: CurrentRecordStore = {
  currentRecord: null,
}

export const useCurrentRecordStore = create<CurrentRecordStore>()(
  persist(
    immer(() => initialCurrentRecordState),
    { name: 'currentRecord' },
  ),
)

export const startCurrentRecord = (plan: Record) => {
  useCurrentRecordStore.setState({
    currentRecord: plan,
  })
}

export const updateCurrentRecord = (
  updatedRecord: Partial<Omit<Record, 'id'>>,
) => {
  useCurrentRecordStore.setState(state => {
    if (!state.currentRecord) return
    return { currentRecord: { ...state.currentRecord, ...updatedRecord } }
  })
}

export const addSet = (set: SetRecord) => {
  useCurrentRecordStore.setState(state => {
    if (!state.currentRecord) return
    state.currentRecord.sets.push(set)
  })
}

export const updateSet = (
  setId: SetRecord['id'],
  updatedSet: Partial<SetRecord>,
) => {
  useCurrentRecordStore.setState(state => {
    if (!state.currentRecord) return

    const setIndex = state.currentRecord.sets.findIndex(s => s.id === setId)
    if (setIndex === -1) return

    state.currentRecord.sets[setIndex] = {
      ...state.currentRecord.sets[setIndex],
      ...updatedSet,
    }
  })
}

export const addRest = (rest: RestRecord) => {
  useCurrentRecordStore.setState(state => {
    if (!state.currentRecord) return
    state.currentRecord.rests.push(rest)
  })
}

export const updateRest = (
  restId: RestRecord['id'],
  updatedRest: Partial<RestRecord>,
) => {
  useCurrentRecordStore.setState(state => {
    if (!state.currentRecord) return

    const restIndex = state.currentRecord.rests.findIndex(r => r.id === restId)
    if (restIndex === -1) return

    state.currentRecord.rests[restIndex] = {
      ...state.currentRecord.rests[restIndex],
      ...updatedRest,
    }
  })
}

export const commitCurrentRecord = () => {
  const { currentRecord } = useCurrentRecordStore.getState()
  if (!currentRecord) return

  addRecord(currentRecord)
  useCurrentRecordStore.setState(initialCurrentRecordState)
}

export const discardCurrentRecord = () => {
  useCurrentRecordStore.setState(initialCurrentRecordState)
}
