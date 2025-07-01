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
  email: yup
    .string()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  personalEmail: yup
    .string()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("PersonalEmail is required"),
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
    street: yup
      .string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(100, "Address cannot exceed 100 characters"),
    city: yup
      .string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/, "City can only contain letters and hyphens"),
    state: yup
      .string()
      .required("State is required")
      .min(2, "State must be at least 2 characters")
      .max(50, "State cannot exceed 50 characters"),
    zip: yup
      .string()
      .required("Zip code is required")
      .matches(/^[0-9\-]+$/, "Zip code can only contain numbers and hyphens")
      .test(
        "zip-length",
        "Zip code must be between 4 and 10 characters",
        (val) =>
          val &&
          val.replace(/\D/g, "").length >= 4 &&
          val.replace(/\D/g, "").length <= 10
      ),
    country: yup
      .string()
      .required("Country is required")
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters"),
  }),
  currentAddress: yup.object().shape({
    street: yup
      .string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(100, "Address cannot exceed 100 characters"),
    city: yup
      .string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s\-']+$/, "City can only contain letters and hyphens"),
    state: yup
      .string()
      .required("State is required")
      .min(2, "State must be at least 2 characters")
      .max(50, "State cannot exceed 50 characters"),
    zip: yup
      .string()
      .required("Zip code is required")
      .matches(/^[0-9\-]+$/, "Zip code can only contain numbers and hyphens")
      .test(
        "zip-length",
        "Zip code must be between 4 and 10 characters",
        (val) =>
          val &&
          val.replace(/\D/g, "").length >= 4 &&
          val.replace(/\D/g, "").length <= 10
      ),
    country: yup
      .string()
      .required("Country is required")
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters"),
  }),
});

export default personalInfoSchema;
