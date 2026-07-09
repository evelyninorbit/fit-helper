'use client'
import * as React from 'react'
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  List,
  Stack,
  ListItem,
  Box,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useExerciseStore } from '@/domain/exercise/store'
import { EExerciseType } from '@/domain/exercise/schema'
import type { Exercise } from '@/domain/exercise/schema'
import type { ExerciseRecord } from '@/domain/record/schema'
import { addExerciseToWorkout } from '@/domain/workout/store'

// Exercise（動作定義）→ ExerciseRecord（這次 workout 的一筆紀錄）
// union type 需要先用 type 窄化，exerciseType 與 sets 的組合才對得起來
const toExerciseRecord = (e: Exercise): ExerciseRecord =>
  e.type === EExerciseType.WEIGHT
    ? {
        id: crypto.randomUUID(),
        exerciseId: e.id,
        exerciseType: e.type,
        note: '',
        sets: [],
      }
    : {
        id: crypto.randomUUID(),
        exerciseId: e.id,
        exerciseType: e.type,
        note: '',
        sets: [],
      }

export const DRAWER_WIDTH = 280

export default function ExerciseSelection() {
  const exercises = useExerciseStore(s => s.exercises)
  const bodyPartId = React.useId()
  const equipmentId = React.useId()

  const [bodyPart, setBodyPart] = React.useState<string>('')
  const [equipment, setEquipment] = React.useState<string>('')

  const displayedExercises = exercises.filter(e => e.display !== false)

  const filtered = displayedExercises.filter(
    e =>
      (!bodyPart || bodyPart === e.bodyPart) &&
      (!equipment || equipment === e.equipment),
  )

  const handleSelectExercise = (exercise: Exercise) => () => {
    const record = toExerciseRecord(exercise)
    addExerciseToWorkout(record)
  }

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 1,
        overflow: 'hidden',
        p: 2,
        '> *': {
          flex: '0 0 auto',
        },
      }}
    >
      <Stack direction='row' spacing={1}>
        <FormControl fullWidth>
          <InputLabel id={`${bodyPartId}-label`}>部位</InputLabel>
          <Select
            labelId={`${bodyPartId}-label`}
            id={`${bodyPartId}-select`}
            label='部位'
            value={bodyPart}
            // store 的 setBodyPart 內會自動把器材重設為「全部」
            onChange={e => setBodyPart(e.target.value)}
          >
            <MenuItem value=''>
              <em>全部</em>
            </MenuItem>
            {Array.from(new Set(displayedExercises.map(e => e.bodyPart))).map(
              part => (
                <MenuItem key={part} value={part}>
                  {part}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id={`${equipmentId}-label`}>器材</InputLabel>
          <Select
            labelId={`${equipmentId}-label`}
            id={`${equipmentId}-select`}
            label='器材'
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
          >
            <MenuItem value=''>
              <em>全部</em>
            </MenuItem>
            {Array.from(new Set(displayedExercises.map(e => e.equipment))).map(
              eq => (
                <MenuItem key={eq} value={eq}>
                  {eq}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Stack>
      <List disablePadding sx={{ overflow: 'auto', flex: '1 1 auto' }}>
        {filtered.map(e => (
          <ListItem key={e.id} disableGutters>
            <ListItemButton
              onClick={handleSelectExercise(e)}
              sx={{
                bgcolor: 'primary.light',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                },
              }}
            >
              <ListItemText primary={e.name} sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
