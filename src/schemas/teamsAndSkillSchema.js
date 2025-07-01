import * as yup from "yup";

const teamsAndSkillSchema = (role) => yup.object().shape({
  managerId: role !== "EMPLOYEE" 
    ? yup.string().optional()
    : yup.string().required("Manager is required"),
  designationId: yup.string().required("Designation is required"),
  teamId: yup.string().required("Team Name is required"),
  department: yup.string().required("Department is required"),
  primarySkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one primary skill is required")
    .required("Primary Skills are required"),
  secondarySkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one secondary skill is required")
    .required("Secondary Skills are required"),
});

export default teamsAndSkillSchema;