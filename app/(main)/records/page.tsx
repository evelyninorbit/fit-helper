"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RecordsByLCalendar from "@/components/Record/RecordsByCalendar";
import RecordsByList from "@/components/Record/RecordsByList";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import NextLink from "@/components/NextLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  const selected = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!selected}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // 沒選中的面板 display: none 完全不佔空間；選中的吃滿剩餘高度，
      // 內部的清單才有明確的可用高度可以自己捲。
      // minHeight: 0 不能省——flex 子元素預設 min-height: auto 會拒絕縮到內容以下
      sx={{
        display: selected ? "flex" : "none",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
      }}
      {...other}
    >
      {selected && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
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
    <Box
      // MainLayout 對直接子元素下了 flex: "0 0 auto"，這裡覆寫成可成長，
      // 高度才會一路傳遞到下方的清單／日曆
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          mt: 2,
          px: 1,
          flexShrink: 0,
          display: "grid",
          // 左右兩欄等寬，中間的 Tabs 才會落在畫面正中央
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          width: "100%",
        }}
      >
        <IconButton
          LinkComponent={NextLink}
          href="/"
          aria-label="返回首頁"
          sx={{ justifySelf: "start" }}
        >
          <ArrowBackIcon sx={{ fontSize: 28, marginLeft: 5 }} />
        </IconButton>

        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="basic tabs example"
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

        {/* 右欄佔位，維持左右對稱 */}
        <Box />
      </Box>
      <CustomTabPanel value={value} index={0}>
        <RecordsByLCalendar />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <RecordsByList />
      </CustomTabPanel>
    </Box>
  );
}
