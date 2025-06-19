import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PersonalInfoTab from "../personalInfo/page";
import TeamsAndSkillTab from "../teamsAndSkill/page";
import SettingTab from "../setting/page";

function CustomTabPanel(props) {
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EmployeeDialogContent() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "515px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{ fontSize: "16px" }}
            label="Personal Info"
            {...a11yProps(0)}
          />

          <Tab
            sx={{ fontSize: "16px" }}
            label="Team & Skill"
            {...a11yProps(1)}
          />
          <Tab sx={{ fontSize: "16px" }} label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <CustomTabPanel value={value} index={0}>
          <PersonalInfoTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TeamsAndSkillTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <SettingTab />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
