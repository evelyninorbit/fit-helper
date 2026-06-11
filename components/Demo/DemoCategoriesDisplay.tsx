'use client'

import type { Category } from '@/domain/category/schema'
import {
  updateCategoryDisplay,
  useCategoriesStore,
} from '@/domain/category/store'
import {
  CheckRounded as CheckRoundedIcon,
  ClearRounded as ClearRoundedIcon,
} from '@mui/icons-material'
import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
  <Card
    onClick={() => updateCategoryDisplay(category.id)}
    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
  >
    <CardContent>
      {/* Display category details: name, description, display, rest, loadUnit */}
      <Typography variant='h6'>{category.name}</Typography>
      <Typography variant='body2' color='textSecondary'>
        {category.description}
      </Typography>
      <Typography
        variant='body2'
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        Display:{' '}
        {category.display ? (
          <CheckRoundedIcon fontSize='inherit' color='success' />
        ) : (
          <ClearRoundedIcon fontSize='inherit' color='error' />
        )}
      </Typography>
      <Typography variant='body2'>Rest: {category.rest} sec.</Typography>
      <Typography variant='body2'>Load Unit: {category.loadUnit}</Typography>
    </CardContent>
  </Card>
)

const LoadingCard: React.FC = () => (
  <Card sx={{ cursor: 'progress' }}>
    <CardContent>
      <Typography variant='h6'>
        <Skeleton animation='wave' width={50} />
      </Typography>
      <Typography variant='body2'>
        <Skeleton animation='wave' width={70} />
      </Typography>
      <Typography variant='body2'>
        <Skeleton animation='wave' width={80} />
      </Typography>
      <Typography variant='body2'>
        <Skeleton animation='wave' width={80} />
      </Typography>
    </CardContent>
  </Card>
)

const DemoCategoriesDisplay: React.FC = () => {
  const categories = useCategoriesStore(s => s.categories)

  return (
    <Stack direction='row' spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {categories.length === 0 &&
        Array.from({ length: 5 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </Stack>
  )
}

export default DemoCategoriesDisplay
