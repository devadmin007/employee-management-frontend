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
  currentSalary: yup
    .string()
    .required("Current Salary is required")
    .matches(/^\d+$/, "Salary must contain only numbers"),
  panNo: yup
    .string()
    .required("PAN Number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format (e.g., ABCDE1234F)"
    ),
  uanDetail: yup
    .string()
    .nullable()
    .test(
      "uan-length",
      "UAN must be 12 digits",
      (value) => !value || (value.length === 12 && /^\d+$/.test(value))
    ),
  pfNo: yup
    .string()
    .nullable()
    .matches(
      /^[A-Za-z0-9]+$/,
      "PF Number can only contain letters and numbers"
    ),
  previousExperience: yup
    .string()
    .nullable()
    .matches(/^\d*\.?\d+$/, "Experience must be a number (in years)"),
});

export default settingSchema;
