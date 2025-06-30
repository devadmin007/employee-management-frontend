import * as yup from "yup";

const personalInfoSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "Image is too large", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= 2000000;
      }
      return true;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
      return true;
    }),
  role: yup.string().required("Role is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  personalNumber: yup
    .string()
    .required("Emergency Mobile is required")
    .matches(/^[0-9]{10}$/, "Emergency Mobile must be 10 digits"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  gender: yup.string().required("Gender is required"),
  permenentAddress: yup.object().shape({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup
      .string()
      .required("Zip Code is required")
      .matches(/^\d{4,10}$/, "Enter a valid zip code"),
    country: yup.string().required("Country is required"),
  }),
  currentAddress: yup.object().shape({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup
      .string()
      .required("Zip Code is required")
      .matches(/^\d{4,10}$/, "Enter a valid zip code"),
    country: yup.string().required("Country is required"),
  }),
});


export default personalInfoSchema;