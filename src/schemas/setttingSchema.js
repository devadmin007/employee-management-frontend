import * as yup from "yup";

const settingSchema = yup.object().shape({
  joiningDate: yup
    .string()
    .required("Joining Date is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  probationDate: yup
    .string()
    .required("Probation Date is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  relievingDate: yup
    .string()
    .nullable()
    .notRequired()
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  currentSalary: yup.string().required("Current Salary is requierd"),
  panNo: yup.string().required("Probation Date is required"),
  uanDetail: yup.string().nullable(),
  pfNo: yup.string().nullable(),
  uanDetail: yup.string().nullable(),
  previousExperience: yup.string().nullable(),
});

export default settingSchema;
