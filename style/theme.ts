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
    secondary:{
      main:'#fae6cd'
    },
    background: {
      default: '#fae6cd',
    },
  },
})

export default theme
