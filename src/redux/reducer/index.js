import authSlice from "@/redux/slice/authSlice";
import employeeDataSlice from "@/redux/slice/employeeDataSlice";

const rootReducer = {
  auth: authSlice,
  employeeData: employeeDataSlice,
};

export default rootReducer;
