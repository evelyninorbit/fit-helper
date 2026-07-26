"use client";

import { useEffect, useRef, useState } from "react";

// 管理單一組的倒數計時，由每個 DurationSetItem 自己持有。
// 倒數只存在記憶體，重新整理或元件 unmount 即消失；歸零時呼叫 onFinish 收尾。
export default function useCountdown(onFinish: () => void) {
  // 剩餘秒數；null = 沒在倒數（未開始或已結束）
  const [remaining, setRemaining] = useState<number | null>(null);
  // 預計歸零的時間點（ms）；null = 暫停中或沒在倒數
  const [endAt, setEndAt] = useState<number | null>(null);

  // 用 ref 保存最新的 onFinish，讓 interval 隨時拿得到，
  // 又不用把它放進 effect 依賴（放了會害父層每次 re-render 都重開 interval）
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  // 倒數中才開 interval。剩餘秒數一律用 endAt 回推，
  // 就算 interval 被瀏覽器節流（切到背景分頁）也不會越走越慢
  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const next = Math.ceil((endAt - Date.now()) / 1000);
      if (next > 0) {
        setRemaining(next);
        return;
      }
      // 歸零：停止倒數並通知外部
      setRemaining(null);
      setEndAt(null);
      onFinishRef.current();
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const start = (seconds: number) => {
    setRemaining(seconds);
    setEndAt(Date.now() + seconds * 1000);
  };

  const pause = () => setEndAt(null);

  const resume = () => {
    if (remaining !== null) setEndAt(Date.now() + remaining * 1000);
  };

  return { remaining, running: endAt !== null, start, pause, resume };
}
