"use client";

import { useEffect } from "react";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { formatDuration } from "@/domain/set/utils";
import useCountdown from "../useCountdown";

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
  const { remaining, start, updateEndAt } = useCountdown(onFinish);

  // dialog 關閉時整個元件會 unmount，所以「掛載」就等於「開始休息」
  useEffect(() => {
    start(seconds);
  }, [seconds, start]);

  return (
    <Stack sx={{ alignItems: "center", gap: 1 }}>
      <Typography variant="h5">組間休息</Typography>
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          width: 200,
          height: 120,
          color: "primary.main",
          mt: 2,
        }}
      >
        {formatDuration(remaining ?? seconds)}
      </Typography>
      <Container
        sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
      >
        {/* 加減的是「終點時間」，倒數不會被打斷重來 */}
        <Button
          variant="outlined"
          onClick={() => updateEndAt(5)}
          sx={{ borderRadius: 2, padding: 2 }}
        >
          +5
        </Button>
        <Button
          variant="outlined"
          onClick={() => updateEndAt(-5)}
          sx={{ borderRadius: 2, padding: 2 }}
        >
          -5
        </Button>
      </Container>
      <TextField
        id="outlined-multiline-flexible"
        multiline
        maxRows={5}
        label="該組筆記"
        variant="outlined"
        sx={{ mt: 2 }}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      ></TextField>
    </Stack>
  );
}
