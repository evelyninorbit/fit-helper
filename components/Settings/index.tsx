'use client'

import { useState } from 'react'
import SettingDialog from './SettingDialog'
import { Box, BoxProps } from '@mui/material'

type SettingsProps = {
  slotProps?: {
    trigger: BoxProps
  }
}

const Settings: React.FC<React.PropsWithChildren<SettingsProps>> = ({
  children,
  slotProps,
}) => {
  const [open, setOpen] = useState(false)

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Box onClick={handleOpen} {...slotProps?.trigger}>
        {children}
      </Box>
      <SettingDialog open={open} onClose={handleClose} />
    </>
  )
}

export default Settings
