'use client'

import { Container, Avatar, Button, Stack } from '@mui/material'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import DirectionsWalkRoundedIcon from '@mui/icons-material/DirectionsWalkRounded';
import SettingsIcon from '@mui/icons-material/Settings'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import NextLink from '@/components/NextLink'
import useWorkoutStore, {

  startWorkout,
} from '@/domain/workout/store'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

const RootPage: React.FC = () => {
  const workout = useWorkoutStore(state => state)
  const router = useRouter()
  const [isNavigating, startNavigation] = useTransition()

  const handleStartWorkout = () => {
    startNavigation(() => {
      startWorkout()
      router.replace('/workoutinprogress')
    })
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
          {workout === null || isNavigating ? (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between'}}
              loading
              loadingPosition='start'
            >
              載入中
            </Button>
          ) : workout.startedAt ? (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
              LinkComponent={NextLink}
              href='./workoutinprogress'
              startIcon={<DirectionsRunRoundedIcon />}
            >
              繼續運動
            </Button>
          ) : (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ height: 64, px: 4, justifyContent: 'space-between' }}
              onClick={handleStartWorkout}
              startIcon={<DirectionsWalkRoundedIcon/>}
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
