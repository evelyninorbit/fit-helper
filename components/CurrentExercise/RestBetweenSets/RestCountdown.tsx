"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatDuration } from "@/domain/set/utils";
import useCountdown from "../useCountdown";

// 一次加減幾秒
const ADJUST_STEP_SECONDS = 5;

type RestCountDownProps = {
  // 這個動作設定的休息秒數（來自 Settings 的預設休息時間）
  seconds: number;
  // 倒數歸零時通知外層（關閉 dialog）
  onFinish: () => void;
  // 剛做完那一組的筆記，直接存進 store（與該組列表上的筆記欄同一份）
  note: string;
  onNoteChange: (note: string) => void;
};

export default function RestCountDown({
  seconds,
  onFinish,
  note,
  onNoteChange,
}: RestCountDownProps) {
  // 倒數歸零後 remaining 會變回 null，靠這個旗標區分「還沒開始」與「已結束」，
  // 否則 dialog 淡出的那段時間會閃回初始秒數
  const [isFinished, setIsFinished] = useState(false);
  const { remaining, start, updateEndAt } = useCountdown(() => {
    setIsFinished(true);
    onFinish();
  });
  // 只用來計數「使用者按了幾次加減」，數值本身沒有意義，變動才是訊號
  const [adjustCount, setAdjustCount] = useState(0);

  // dialog 關閉時整個元件會 unmount，所以「掛載」就等於「開始休息」
  useEffect(() => {
    start(seconds);
  }, [seconds, start]);

  const handleAdjust = (deltaSeconds: number) => {
    updateEndAt(deltaSeconds);
    setAdjustCount((count) => count + 1);
  };

  // 第一個 tick 之前 remaining 還是 null，先顯示設定的總秒數；
  // 結束後停在 0，不要退回總秒數
  const displayed = isFinished ? 0 : (remaining ?? seconds);
  // 剩餘時間已經不夠減：再減下去會直接歸零、休息被迫結束
  const canReduce = displayed > ADJUST_STEP_SECONDS;

  return (
    <Stack sx={{ width: "100%", alignItems: "center", gap: 1 }}>
      <Typography variant="h5">組間休息</Typography>
      <Typography
        variant="h3"
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          width: "100%",
          height: 120,
          color: "primary.main",
          mt: 2,
          // 外框緩慢明暗，把視線帶回計時器。
          // 只動 box-shadow 不動尺寸，所以不會撐開版面
          "@keyframes restFrameGlow": {
            "0%, 100%": {
              boxShadow: `0 0 4px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            "50%": {
              boxShadow: `0 0 16px 3px ${alpha(theme.palette.primary.main, 0.5)}`,
            },
          },
          animation: "restFrameGlow 2600ms ease-in-out infinite",
          // 尊重系統的「減少動態效果」設定
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        })}
      >
        {/* key 一變就重新掛載，CSS 動畫跟著從頭播一次。
            adjustCount 只有按下加減時才變，所以平常倒數不會跳 */}
        <Box
          component="span"
          key={adjustCount}
          sx={{
            "@keyframes restCountdownPulse": {
              "0%": { transform: "scale(1)" },
              "35%": { transform: "scale(1.18)" },
              "100%": { transform: "scale(1)" },
            },
            display: "inline-block",
            // 還沒按過任何加減時不播，避免 dialog 一開就彈一下
            animation:
              adjustCount > 0 ? "restCountdownPulse 600ms ease-out" : "none",
            // 尊重系統的「減少動態效果」設定
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          {formatDuration(displayed)}
        </Box>
      </Typography>
      <Container
        sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
      >
        {/* 加減的是「終點時間」，倒數不會被打斷重來 */}
        <Button
          variant="contained"
          onClick={() => handleAdjust(ADJUST_STEP_SECONDS)}
          sx={{ borderRadius: 2, padding: 1, fontSize: 25 }}
        >
          +{ADJUST_STEP_SECONDS}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdjust(-ADJUST_STEP_SECONDS)}
          disabled={!canReduce}
          sx={{ borderRadius: 2, padding: 1, fontSize: 25 }}
        >
          -{ADJUST_STEP_SECONDS}
        </Button>
      </Container>
      <TextField
        id="outlined-multiline-flexible"
        multiline
        rows={11}
        label="該組筆記"
        variant="outlined"
        sx={{ mt: 2, width: "100%" }}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      ></TextField>
    </Stack>
  );
}
