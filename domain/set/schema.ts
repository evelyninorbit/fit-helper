export type SetBasicRecord = {
  id: string;
  startedAt: string;
  finishedAt: string;
  note: string;
};

export type SetRecordWithLoad = SetBasicRecord & {
  load: number;
  reps: number;
};

export type SetRecordWithDuration = SetBasicRecord & {
  duration: number;
};

export type SetRecord = SetRecordWithLoad | SetRecordWithDuration;
