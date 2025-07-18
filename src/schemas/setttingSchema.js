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
    .nullable()
    .test(
      "is-numeric",
      "Salary must contain only numbers",
      (value) => !value || /^\d+$/.test(value)
    ),
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
    .test(
      "is-alphanumeric",
      "PF Number can only contain letters and numbers",
      (value) => !value || /^[A-Za-z0-9]+$/.test(value)
    ),
  previousExperience: yup
    .string()
    .nullable()
    .test(
      "valid-experience",
      "Experience must be a number (e.g. 2 or 2.5 years)",
      (value) => {
        if (!value) return true;
        return /^\d*\.?\d+$/.test(value);
      }
    ),
});

export default settingSchema;
