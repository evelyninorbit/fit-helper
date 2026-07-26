"use client";
import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import SettingDefaultRestTime from "./SettingDefaultRestTime";
import ExerciseFilter from "./ExerciseFilter";
import { useExerciseStore } from "@/domain/exercise/store";
import SettingExerciseDisplay from "./SettingExerciseDisplay";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SettingTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabSx = {
    borderRadius: 2,
    "&.Mui-selected": { bgcolor: "primary.main", color: "#ffffff" },
  } as const;

  const exercises = useExerciseStore((s) => s.exercises);
  const [bodyPart, setBodyPart] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");

  const filtered = exercises.filter(
    (e) =>
      (!bodyPart || bodyPart === e.bodyPart) &&
      (!equipment || equipment === e.equipment)
  );

  return (
    <Container
      maxWidth="sm"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            marginTop: 2,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            slotProps={{ indicator: { sx: { display: "none" } } }}
          >
            <Tab sx={tabSx} label="顯示／隱藏動作" {...a11yProps(0)} />
            <Tab sx={tabSx} label="設定組間秒數" {...a11yProps(1)} />
          </Tabs>
          <Box sx={{ width: "100%" }}>
            <ExerciseFilter
              bodyPart={bodyPart}
              setBodyPart={setBodyPart}
              equipment={equipment}
              setEquipment={setEquipment}
            />
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            marginY: 2,
          }}
        >
          <CustomTabPanel value={value} index={0}>
            <SettingExerciseDisplay filtered={filtered} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SettingDefaultRestTime filtered={filtered} />
          </CustomTabPanel>
        </Box>
      </Box>
    </Container>
  );
}
