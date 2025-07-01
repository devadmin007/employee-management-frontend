import * as yup from "yup";

const bankSchema = yup.object().shape({
  bankDetails: yup.object().shape({
    accountNumber: yup
      .string()
      .required("Account Number is required")
      .matches(/^\d{9,18}$/, "Account Number must be 9-18 digits")
      .test(
        "no-spaces",
        "Account Number cannot contain spaces",
        (value) => !/\s/.test(value)
      ),
    ifscCode: yup
      .string()
      .required("IFSC Code is required")
      .matches(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Invalid IFSC Code (e.g., SBIN0001234)"
      )
      .uppercase()
      .test(
        "no-spaces",
        "IFSC Code cannot contain spaces",
        (value) => !/\s/.test(value)
      ),
    branchName: yup
      .string()
      .required("Branch Name is required")
      .min(3, "Branch Name must be at least 3 characters")
      .max(50, "Branch Name cannot exceed 50 characters")
      .matches(
        /^[a-zA-Z\s\-']+$/,
        "Branch Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
  }),
});

export default bankSchema;
