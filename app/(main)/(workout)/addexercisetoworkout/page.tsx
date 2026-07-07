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
  ButtonGroup,
  IconButton,
  Box
} from '@mui/material'
import {
  useExercises,
  useBodyPart,
  useEquipment,
  setBodyPart,
  setEquipment,
  useFilteredExercises,
} from '@/domain/exercise/store'
import { EExerciseType } from '@/domain/exercise/schema'
import type { Exercise } from '@/domain/exercise/schema'
import type { ExerciseRecord } from '@/domain/record/schema'
import useWorkoutStore, { addExerciseToWorkout } from '@/domain/workout/store'
import { useRouter } from 'next/navigation'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import SettingsIcon from "@mui/icons-material/Settings";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import NextLink from "next/link";

const ALL = '' as const

// Exercise（動作定義）→ ExerciseRecord（這次 workout 的一筆紀錄）
// union type 需要先用 type 窄化，exerciseType 與 sets 的組合才對得起來
const toExerciseRecord = (e: Exercise): ExerciseRecord =>
  e.type === EExerciseType.WEIGHT
    ? { id: crypto.randomUUID(), exerciseId: e.id, exerciseType: e.type, note: '', sets: [] }
    : { id: crypto.randomUUID(), exerciseId: e.id, exerciseType: e.type, note: '', sets: [] }

export default function SelectExerciseToWorkout() {
  const exercises = useExercises()
  const bodyPartId = React.useId()
  const equipmentId = React.useId()
  const router = useRouter()

  // 被點選的動作 id，陣列順序＝點選順序
  const [selectedIds, setSelectedIds] = React.useState<Exercise['id'][]>([])

  // 這次 workout 已經加入幾個動作——順序數字要從它之後接續
  const existingCount = useWorkoutStore(state => state?.exercise.length ?? 0)

  const toggleSelect = (id: Exercise['id']) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    )
  }

  // 打勾時先轉頁，store 留到本頁 unmount（轉頁完成）才寫，
  // 不然 existingCount 會即時跳動、徽章數字在跳頁前先變大
  const pendingRecords = React.useRef<ExerciseRecord[]>([])

  React.useEffect(() => {
    return () => {
      pendingRecords.current.forEach(addExerciseToWorkout)
    }
  }, [])

  const handleConfirm = () => {
    pendingRecords.current = selectedIds.flatMap(id => {
      const exercise = exercises.find(e => e.id === id)
      return exercise ? [toExerciseRecord(exercise)] : []
    })
    router.push('/workoutinprogress')
  }

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
    // maxWidth="sm"：手機全寬、桌機收成 600px 中欄，跟 workoutinprogress 同一套版心
    <Container maxWidth="sm" sx={{ pb: 12 }}>
      <Stack sx={{ alignItems: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
      </Box>

      <List sx={{  width: { xs: "80%", sm: "50%" }, }}>
        {filtered.filter((e)=>e.display !== false).map(e => {
          // indexOf 回傳在陣列中的位置（沒選到是 -1），+1 就是點選順序
          const order = selectedIds.indexOf(e.id)
          const selected = order !== -1
          return (
            <ListItem
              key={e.id}
              onClick={() => toggleSelect(e.id)}
              sx={{
                bgcolor: selected ? 'primary.light' : 'action.hover',
                color: selected ? '#ffffff' : 'inherit',
                my: 2,
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              {selected && (
                <Box
                  component="span"
                  sx={{
                    mr: 2,
                    width: 24,
                    height: 24,
                    borderRadius:2,
                    bgcolor: '#ffffff',
                    color: 'primary.light',
                    fontSize: 14,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {existingCount + order + 1}
                </Box>
              )}
              {e.name}
              
            </ListItem>
          )
        })}
      </List>
      <ButtonGroup
        variant="contained"
        sx={{
          // 底部操作列：手機貼滿全寬，桌機對齊 600px 版心
          width: { xs: "100%", sm: 600 },
          bgcolor:'primary.main',
          justifyContent: "space-around",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          mx: "auto",
          py: 1,
        }}
      >
        <IconButton
          sx={{ color: "primary.contrastText" }}
          LinkComponent={NextLink}
          href="/workoutinprogress"
          aria-label="不儲存並返回"
        >
          <KeyboardBackspaceRoundedIcon />
        </IconButton>
        <IconButton sx={{ color: "primary.contrastText" }} LinkComponent={NextLink} href="/settings">
          <SettingsIcon />
        </IconButton>
        <IconButton
          sx={{ color: "primary.contrastText" }}
          onClick={handleConfirm}
          aria-label="加入選取的動作"
        >
          <CheckRoundedIcon />
        </IconButton>
      </ButtonGroup>
      </Stack>
    </Container>
  )
}
