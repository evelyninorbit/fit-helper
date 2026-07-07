"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SelectExercise from "./SelectExercise";
import SetTimeInterval from "./SetTimeInterval";
import { Container } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabSx = {
    borderRadius: 2,
    "&.Mui-selected": { bgcolor: "primary.main", color: "#ffffff" },
  } as const;

  return (
    <Container maxWidth="sm" sx={{ position: "relative" }}>
      {/* 絕對定位讓箭頭不佔 flex 空間，Tabs 的置中才不會被擠歪；top 對齊 48px 高的 Tabs 列 */}
      <IconButton
        onClick={() => router.back()}
        sx={{ position: "absolute", left: 8, top: 4 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            slotProps={{ indicator: { sx: { display: "none" } } }}
          >
            <Tab sx={tabSx} label="顯示／隱藏動作" {...a11yProps(0)} />
            <Tab sx={tabSx} label="設定組間秒數" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <SelectExercise />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <SetTimeInterval />
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
