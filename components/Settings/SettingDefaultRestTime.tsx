"use client";
import { Exercise } from "@/domain/exercise/schema";
import { updateRestTime } from "@/domain/exercise/store";
import {
  Grid,
  List,
  ListItem,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useId } from "react";

type SettingDefaultRestTimeProps = {
  filtered: Exercise[]
}

export default function SettingDefaultRestTime({filtered}:SettingDefaultRestTimeProps) {
  const outlinedWeightId = useId();

  return (
    <List>
      {filtered
        .filter((e) => e.display)
        .map((s) => (
          <ListItem key={s.id} disableGutters>
            <Grid
              container
              spacing={2}
              direction="row"
              sx={{
                width: "100%",
                alignItems: "strech",
              }}
            >
              <Grid
                size={8}
                sx={{
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 2,
                }}
              >
                {s.name}
              </Grid>
              <Grid
                size={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <OutlinedInput
                    type="number"
                    id={`${outlinedWeightId}-${s.id}input`}
                    endAdornment={
                      <InputAdornment position="end">秒</InputAdornment>
                    }
                    aria-describedby={`${outlinedWeightId}-helper-text`}
                    inputProps={{
                      "aria-label": "second",
                    }}
                    value={s.restTime}
                    sx={{ "& input": { textAlign: "center" }}}
                    onChange={(e)=>updateRestTime(s.id,Number(e.target.value))}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </ListItem>
        ))}
    </List>
  );
}

