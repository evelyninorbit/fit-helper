"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RecordsByLCalendar from "@/components/Record/RecordsByCalendar";
import RecordsByList from "@/components/Record/RecordsByList";
import HomeIcon from "@mui/icons-material/Home";
import NextLink from "@/components/NextLink";

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
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function RecordsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="basic tabs example"
          sx={{
            width: "80%",
            display: "flex",
            gap: 10,
          }}
        >
          <Tab
            icon={<CalendarMonthIcon sx={{ fontSize: 30 }} />}
            {...a11yProps(0)}
          />
          <Tab
            icon={<FormatListBulletedIcon sx={{ fontSize: 30 }} />}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <RecordsByLCalendar />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <RecordsByList />
      </CustomTabPanel>
      <Fab
        LinkComponent={NextLink}
        href="/"
        color="primary"
        aria-label="回首頁"
        // 外層 layout 固定 100dvh 不捲動，用 fixed 就能穩定貼在畫面右下角
        sx={{ position: "fixed", right: 20, bottom: 20 }}
      >
        <HomeIcon />
      </Fab>
    </Box>
  );
}
