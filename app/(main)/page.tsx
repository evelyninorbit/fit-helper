import { DemoCategoriesDisplay } from '@/components/Demo'
import DemoSection from '@/components/Demo/DemoSection'
import { Container, Paper, Typography } from '@mui/material'

const RootPage: React.FC = () => {
  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Welcome to the Root Page
        </Typography>
        <Typography variant='body1'>
          This is the main page of the application.
        </Typography>
      </Paper>

      <DemoSection
        title='Demo Categories Display'
        description='This section demonstrates the categories display component.'
      >
        <DemoCategoriesDisplay />
      </DemoSection>
    </Container>
  )
}

export default RootPage
