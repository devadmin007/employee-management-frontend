import * as yup from "yup";

const bankSchema = yup.object().shape({
  bankDetails: yup.object().shape({
    accountNumber: yup.string().required("Account Number is required"),
    ifscCode: yup.string().required("IFSC Code is required"),
    branchName: yup.string().required("Branch Name is required"),
  }),
});

export default bankSchema;
