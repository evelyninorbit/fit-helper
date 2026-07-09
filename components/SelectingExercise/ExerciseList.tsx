'use client'

import { useExerciseStore } from '@/domain/exercise/store'
import { getExerciseName } from '@/domain/exercise/utils'
import useWorkoutStore, {
  removeExerciseFromWorkout,
} from '@/domain/workout/store'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText } from '@mui/material'

const ExerciseList: React.FC = () => {
  const workoutExercises = useWorkoutStore(s => s?.exercise)
  const exercises = useExerciseStore(s => s.exercises)

  return (
    <List sx={{ width: 1 / 1 }}>
      {workoutExercises?.map(record => (
        <ListItem
          key={record.id}
          sx={{
            py: 1,
            px: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            '&:not(:last-child)': {
              mb: 1,
            },
          }}
        >
          <ListItemText
            primary={getExerciseName(record.exerciseId, exercises)}
          />
          <IconButton
            sx={{ color: 'primary.contrastText' }}
            size='small'
            aria-label='移除動作'
            onClick={() => removeExerciseFromWorkout(record.id)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}

export default ExerciseList
