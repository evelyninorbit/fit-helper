'use client'

import useWorkoutStore from '@/domain/workout/store'

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loading = useWorkoutStore(state => state === null)

  return loading ? null : children
}

export default MainLayout
