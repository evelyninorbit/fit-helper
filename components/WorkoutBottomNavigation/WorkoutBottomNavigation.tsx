import { finishWorkout, resetWorkout } from '@/domain/workout/store'
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import {
  BottomNavigation,
  BottomNavigationAction,
  bottomNavigationActionClasses,
  IconButton,
} from '@mui/material'
import Settings from '../Settings'

const WorkoutBottomNavigation: React.FC = () => {
  const handleDiscardWorkout = () => {
    resetWorkout()
  }

  const handleCompleteWorkout = () => {
    finishWorkout()
  }

  return (
    <BottomNavigation
      showLabels
      sx={{
        width:'100%',
        bgcolor: 'primary.main',
        [`.${bottomNavigationActionClasses.root}`]: {
          color: 'primary.contrastText',
        },
      }}
    >
      <BottomNavigationAction
        disableRipple
        icon={
          <IconButton
            component='span'
            onClick={handleDiscardWorkout}
            color='inherit'
          >
            <DeleteIcon />
          </IconButton>
        }
        sx={{ cursor: 'default', color: 'inherit' }}
      />
      <BottomNavigationAction
        disableRipple
        icon={
          <Settings>
            <IconButton component='span' color='inherit'>
              <SettingsIcon />
            </IconButton>
          </Settings>
        }
        sx={{ cursor: 'default' }}
      />
      <BottomNavigationAction
        disableRipple
        icon={
          <IconButton
            component='span'
            onClick={handleCompleteWorkout}
            color='inherit'
          >
            <SaveIcon />
          </IconButton>
        }
        sx={{ cursor: 'default' }}
      />
    </BottomNavigation>
  )
}

export default WorkoutBottomNavigation
