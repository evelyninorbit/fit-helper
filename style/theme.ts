'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primary: {
      light: '#f2b0af',
      main: '#de555a',
      dark: '#a12533',
      contrastText: '#fff',
    },
  },
})

export default theme
