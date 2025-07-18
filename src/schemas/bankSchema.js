import * as yup from "yup";

const bankSchema = yup.object().shape({
  bankDetails: yup.object().shape({
    accountNumber: yup
      .string()
      .test(
        "account-number-format",
        "Must be 9-18 digits without spaces",
        (value) => {
          if (value && value.trim().length > 0) {
            return /^\d{9,18}$/.test(value) && !/\s/.test(value);
          }
          return true; 
        }
      ),
    ifscCode: yup
      .string()
      .test(
        "ifsc-format",
        "Must be in format (e.g., SBIN0001234) without spaces",
        (value) => {
          if (value && value.trim().length > 0) {
            return (
              /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()) &&
              !/\s/.test(value)
            );
          }
          return true;
        }
      ),
    branchName: yup
      .string()
      .test(
        "branch-name-format",
        "Only letters, spaces, hyphens, and apostrophes allowed",
        (value) => {
          if (value && value.trim().length > 0) {
            return /^[a-zA-Z\s\-']+$/.test(value);
          }
          return true;
        }
      ),
  }),
});

export default bankSchema;
