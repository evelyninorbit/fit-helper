import { create } from 'zustand'
import type { Category } from './schema'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

export type CategoryStore = {
  categories: Category[]
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: crypto.randomUUID(),
    name: '胸',
    rest: 90,
    display: true,
    loadUnit: 'kg',
  },
  {
    id: crypto.randomUUID(),
    name: '背',
    rest: 90,
    display: true,
    loadUnit: 'kg',
  },
  {
    id: crypto.randomUUID(),
    name: '肩',
    rest: 90,
    display: true,
    loadUnit: 'kg',
  },
  {
    id: crypto.randomUUID(),
    name: '腿',
    rest: 120,
    display: true,
    loadUnit: 'kg',
  },
  {
    id: crypto.randomUUID(),
    name: '手臂',
    rest: 60,
    display: true,
    loadUnit: 'kg',
  },
  {
    id: crypto.randomUUID(),
    name: '核心',
    rest: 60,
    display: true,
    loadUnit: 'kg',
  },
] as const

const defaultCategories: Category[] = []

const initialCategoriesState: CategoryStore = {
  categories: defaultCategories,
  isLoading: false,
}

export const useCategoriesStore = create<CategoryStore>()(
  persist(
    immer(() => initialCategoriesState),
    {
      name: 'categories',
      onRehydrateStorage: () => (state, error) => {
        if (state && state.categories.length === 0)
          state.categories = MOCK_CATEGORIES

        if (error) console.error('Failed to rehydrate categories store', error)
      },
    },
  ),
)

export const updateCategoryDisplay = (categoryId: Category['id']) => {
  useCategoriesStore.setState(state => {
    const index = state.categories.findIndex(
      category => category.id === categoryId,
    )
    if (index === -1) return
    state.categories[index].display = !state.categories[index].display
  })
}

export const updateCategoryRest = (
  categoryId: Category['id'],
  restInSeconds: Category['rest'],
) => {
  useCategoriesStore.setState(state => {
    const index = state.categories.findIndex(
      category => category.id === categoryId,
    )
    if (index === -1) return
    state.categories[index].rest = restInSeconds
  })
}
