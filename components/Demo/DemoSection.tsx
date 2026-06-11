import { Divider, Paper, Typography } from '@mui/material'

const DemoSection: React.FC<
  React.PropsWithChildren<{ title?: string; description?: string }>
> = ({ title, description, children }) => (
  <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }} component='section'>
    {title && (
      <Typography variant='h6' component='h2' gutterBottom>
        {title}
      </Typography>
    )}
    {description && (
      <Typography
        variant='body2'
        color='textSecondary'
        gutterBottom
        sx={{ mb: 1 }}
      >
        {description}
      </Typography>
    )}
    {title || description ? <Divider sx={{ mb: 2 }} /> : null}
    {/* This section will contain demo components */}
    {children}
  </Paper>
)

export default DemoSection
