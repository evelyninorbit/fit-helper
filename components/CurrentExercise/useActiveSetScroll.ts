'use client'

import { useEffect, useRef } from 'react'

// 讓「現在該做的那組」自動保持在列表可視範圍的中央。
// 掛在會捲動的那個 List 上；卡片只要標上 data-active-set="true" 就會被找到。
// 換組（activeIndex 變）與新增/刪除組（setCount 變）都重新對位。
export default function useActiveSetScroll(
  activeIndex: number,
  setCount: number,
) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    // activeIndex 為 -1 代表所有組都做完了，沒有要對位的目標
    if (!list || activeIndex === -1) return

    // rAF：等這一輪排版完成再量位置，否則剛新增的那組還沒有高度，會算到錯的位置
    const raf = requestAnimationFrame(() => {
      const target = list.querySelector<HTMLElement>('[data-active-set="true"]')
      if (!target) return
      const listRect = list.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      // 目標中心對齊容器中心；scrollTo 會自動夾在 0 ~ 可捲動上限之間
      const delta =
        targetRect.top -
        listRect.top -
        (list.clientHeight - targetRect.height) / 2
      list.scrollTo({ top: list.scrollTop + delta, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(raf)
  }, [activeIndex, setCount])

  return listRef
}
