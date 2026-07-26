import { persist } from "zustand/middleware";
import { Record, ExerciseRecord } from "./schema";
import { SetRecord } from "../set/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type RecordsStore = {
  records: Record[];
};

const defaultRecords: Record[] = [];

const initialRecordsState: RecordsStore = {
  records: defaultRecords,
};

export const useRecordsStore = create<RecordsStore>()(
  persist(
    immer(() => initialRecordsState),
    { name: "records" }
  )
);

export const addRecord = (record: Record) => {
  useRecordsStore.setState((state) => {
    state.records.unshift(record);
  });
};

export const updateRecord = (
  recordId: Record["id"],
  updatedRecord: Partial<Record>
) => {
  useRecordsStore.setState((state) => {
    const index = state.records.findIndex((record) => record.id === recordId);
    if (index === -1) return;
    state.records[index] = { ...state.records[index], ...updatedRecord };
  });
};

export const updateSetInRecords = (
  recordId: Record["id"],
  exerciseId: ExerciseRecord["id"],
  setId: SetRecord["id"],
  updatedSet: Partial<SetRecord>
) => {
  useRecordsStore.setState((state) => {
    const record = state.records.find((r) => r.id === recordId);
    if (!record) return;

    const exercise = record.exercise.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const set = (exercise.sets as SetRecord[]).find((s) => s.id === setId);
    if (!set) return;

    Object.assign(set, updatedSet);
  });
};

export const removeRecord = (recordId: Record["id"]) => {
  useRecordsStore.setState((state) => {
    const index = state.records.findIndex((record) => record.id === recordId);
    if (index === -1) return;
    state.records.splice(index, 1);
  });
};
