'use client'

import { Container, Avatar, Button, Stack } from '@mui/material'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import SettingsIcon from '@mui/icons-material/Settings'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import NextLink from '@/components/NextLink'
import useWorkoutStore, {
  resetWorkout,
  startWorkout,
} from '@/domain/workout/store'
import { addRecord } from '@/domain/record/store'
import { useId } from 'react'

const RootPage: React.FC = () => {
  const uid = useId()
  const workout = useWorkoutStore(state => state)

  const handleStartWorkout = () => {
    startWorkout()
  }

  const handleCompleteWorkout = () => {
    if (!workout?.startedAt) return
    addRecord({
      ...workout,
      id: uid,
      finishedAt: new Date().toISOString(),
    })
    resetWorkout()
  }

  return (
    <Container
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack direction='column' spacing={10} sx={{ alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }} />

        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
          }}
        >
          {workout === null
            ? '(載入中)'
            : workout.startedAt
              ? '(進行中)'
              : '(尚未開始)'}
          {workout === null ? (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
              onClick={handleCompleteWorkout}
              loading={true}
            >
              載入中
            </Button>
          ) : workout.startedAt ? (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
              onClick={handleCompleteWorkout}
              startIcon={<DoneAllRoundedIcon />}
            >
              完成運動
            </Button>
          ) : (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
              onClick={handleStartWorkout}
              startIcon={<DirectionsRunRoundedIcon />}
            >
              開始運動
            </Button>
          )}
          <Button
            LinkComponent={NextLink}
            href='/settings'
            fullWidth
            variant='contained'
            color='primary'
            sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
            startIcon={<SettingsIcon />}
          >
            設定動作
          </Button>
          <Button
            LinkComponent={NextLink}
            href='/records'
            fullWidth
            variant='contained'
            color='primary'
            sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
            startIcon={<LibraryBooksIcon />}
          >
            查看紀錄
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default RootPage
