'use client'

import { Add as AddIcon } from '@mui/icons-material'
import { Button, SwipeableDrawer } from '@mui/material'
import { useState } from 'react'
import ExerciseSelection from './ExerciseSelection'

const AddExercise = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        variant='outlined'
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleOpen}
        fullWidth
        size='large'
        sx={{
          borderStyle: 'dashed',
        }}
      >
        新增運動
      </Button>
      <SwipeableDrawer
        anchor='left'
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <ExerciseSelection />
      </SwipeableDrawer>
    </>
  )
}

export default AddExercise
