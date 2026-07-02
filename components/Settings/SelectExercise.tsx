'use client'
import * as React from 'react'
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  List,
  Container,
  Stack,
  ListItem,
} from '@mui/material'
import {
  useExercises,
  updateExerciseDisplay,
  useBodyPart,
  useEquipment,
  setBodyPart,
  setEquipment,
  useFilteredExercises,
} from '@/domain/exercise/store'

const ALL = '' as const

export default function SelectExercise() {
  const exercises = useExercises()
  const bodyPartId = React.useId()
  const equipmentId = React.useId()

  // 篩選狀態改放在 store，讓其他頁面共享同步
  const bodyPart = useBodyPart()
  const equipment = useEquipment()

  // 部位選項：直接從資料推導出不重複的部位
  const bodyParts = React.useMemo(
    () => Array.from(new Set(exercises.map(e => e.bodyPart))),
    [exercises],
  )

  // 器材選項：交叉篩選的關鍵——只列出「目前部位」底下有的器材
  const equipments = React.useMemo(() => {
    const pool =
      bodyPart === ALL
        ? exercises
        : exercises.filter(e => e.bodyPart === bodyPart)
    return Array.from(new Set(pool.map(e => e.equipment)))
  }, [exercises, bodyPart])

  // 最終被兩個條件過濾後的動作清單（取自 store）
  const filtered = useFilteredExercises()

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id={`${bodyPartId}-label`}>部位</InputLabel>
          <Select
            labelId={`${bodyPartId}-label`}
            id={`${bodyPartId}-select`}
            label='部位'
            value={bodyPart}
            // store 的 setBodyPart 內會自動把器材重設為「全部」
            onChange={e => setBodyPart(e.target.value)}
          >
            <MenuItem value={ALL}>
              <em>全部</em>
            </MenuItem>
            {bodyParts.map(part => (
              <MenuItem key={part} value={part}>
                {part}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id={`${equipmentId}-label`}>器材</InputLabel>
          <Select
            labelId={`${equipmentId}-label`}
            id={`${equipmentId}-select`}
            label='器材'
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
          >
            <MenuItem value={ALL}>
              <em>全部</em>
            </MenuItem>
            {equipments.map(eq => (
              <MenuItem key={eq} value={eq}>
                {eq}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>

      <List sx={{ width: '50%' }}>
        {filtered.map(e => (
          <ListItem
            key={e.id}
            onClick={() => updateExerciseDisplay(e.id)}
            sx={{
              my: 2,
              borderRadius: 2,
              bgcolor: e.display ? 'primary.light' : 'action.hover',
              cursor: 'pointer',
            }}
          >
            {e.name}
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
