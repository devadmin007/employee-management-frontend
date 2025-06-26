import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeDetails: {
    // employeeID: null,
    roleId: null,
    personalDetails: null,
    teamAndSkillDetails: null,
    settingDetails: null,
    bankDetails: null,
  },
};

const employeeDataSlcie = createSlice({
  name: "employeeData",
  initialState,
  reducers: {
    addEmployeeDataInfo: (state, action) => {
      const {
        type,
        personalDetail,
        teamAndSkillDetail,
        settingDetail,
        bankDetail,
        roleID,
        // employeeID,
      } = action.payload;

      switch (type) {
        case "personalInfo":
          state.employeeDetails.personalDetails = { ...(personalDetail ?? {}) };
          state.countryDetails.roleId = roleID ?? null;
          break;

        case "teamAndSkillInfo":
          state.employeeDetails.teamAndSkillDetails = {
            ...(teamAndSkillDetail ?? {}),
          };
          break;

        case "settingInfo":
          state.employeeDetails.settingDetails = { ...(settingDetail ?? {}) };
          break;

        case "bankInfo":
          state.employeeDetails.bankDetails = { ...(bankDetail ?? {}) };
          break;

        default:
          break;
      }
    },
    clearEmployeeData: () => initialState,
  },
});

export const { addEmployeeDataInfo, clearEmployeeData } =
  employeeDataSlcie.actions;

export default employeeDataSlcie.reducer;
