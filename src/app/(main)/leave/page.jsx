// // Updated Page component with proper totalCount-based pagination

// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Stack,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Controller } from "react-hook-form";
// import dayjs from "dayjs";
// import { toast } from "react-toastify";
// import CommonDeleteModal from "@/components/CommonDelete";
// import CommonTable from "@/components/CommonTable";

// const Page = () => {
//   const [open, setOpen] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [deleteId, setDeleteId] = useState([]);
//   const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
//   const [updateId, setUpdateId] = useState([]);
//   const [originalSkillValue, setOriginalSkillValue] = useState(""); // Store original value

//   // Separate loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Pagination and search state
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(5);
//   const [search, setSearch] = useState("");
//   const [rows, setRows] = useState([]);
//   const [totalCount, setTotalCount] = useState(0); // Total records count
//   const [totalPages, setTotalPages] = useState(1); // Total pages

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm();

//   const columns = [
//     {
//       field: "_id",
//       headerName: "ID",
//       flex: 1,
//       minWidth: 100,
//       renderCell: (params) => {
//         const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
//         return <Typography>{(page - 1) * limit + rowIndex + 1}</Typography>;
//       },
//     },
//     { field: "label", headerName: "Name", flex: 1, minWidth: 140 },
//     {
//       field: "createdAt",
//       headerName: "Requested Date",
//       flex: 1,
//       minWidth: 140,
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         return <Typography>{date.toLocaleDateString()}</Typography>;
//       },
//     },
//     {
//       field: "x",
//       headerName: "Start Date",
//       flex: 1,
//       minWidth: 140,
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         return <Typography>{date.toLocaleDateString()}</Typography>;
//       },
//     },
//     {
//       field: "y",
//       headerName: "End Date",
//       flex: 1,
//       minWidth: 140,
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         return <Typography>{date.toLocaleDateString()}</Typography>;
//       },
//     },
//     { field: "z", headerName: "Days", flex: 1, minWidth: 140 },
//     { field: "a", headerName: "Status", flex: 1, minWidth: 140 },
//     { field: "b", headerName: "Approver", flex: 1, minWidth: 140 },
//     { field: "c", headerName: "Notes", flex: 1, minWidth: 140 },

//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 120,
//       sortable: false,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={1}>
//           <Tooltip title="Edit skill">
//             <IconButton
//               color="primary"
//               onClick={() => handleClickOpenDialogForFormToEditTeam(params?.id)}
//               size="small"
//             >
//               <EditIcon sx={{ color: "#1976D2" }} />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete skill">
//             <IconButton
//               color="error"
//               onClick={() => handleClickOpenDialog(params?.id)}
//               size="small"
//             >
//               <DeleteIcon sx={{ color: "#d32f2f" }} />
//             </IconButton>
//           </Tooltip>
//         </Stack>
//       ),
//     },
//   ];

//   useEffect(() => {
//     getSkill();
//   }, [page, search, limit]);

//   const getSkill = async () => {
//     setIsLoading(true);
//     try {
//       const result = await getAllSkillApi(page, limit, search);
//       if (result?.data?.status === "success") {
//         setRows(result.data.data.skill);

//         // Get totalCount from API response
//         const totalCount = result.data.data.totalCount;
//         setTotalCount(totalCount);

//         // Calculate total pages based on totalCount and limit
//         const calculatedTotalPages = Math.ceil(totalCount / limit);
//         setTotalPages(calculatedTotalPages);
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to fetch skills");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (newLimit) => {
//     setLimit(newLimit);
//     setPage(1); // Reset to first page when changing page size
//   };

//   const handleSearchChange = (searchValue) => {
//     setSearch(searchValue);
//     setPage(1); // Reset to first page when searching
//   };

//   const handleClickOpen = () => setOpen(true);

//   const handleClose = () => {
//     setOpen(false);
//     reset();
//   };

//   const handleClickOpenDialog = (id) => {
//     setDeleteId(id);
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     reset();
//   };

//   const handleClickOpenDialogForFormToEditTeam = async (id) => {
//     setUpdateId(id);
//     setOpenUpdateDialog(true);
//     setIsLoading(true);
//     try {
//       const result = await getSkillByIdApi(id);
//       const skillData = result.data.data;
//       setValue("skill", skillData.label);
//       setOriginalSkillValue(skillData.label); // Store original value
//     } catch (e) {
//       console.log(e);
//       toast.error("Failed to fetch skill data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClickCloseDialogForFormToEditManager = () => {
//     setOpenUpdateDialog(false);
//     setOriginalSkillValue(""); // Clear original value
//     reset();
//   };

//   const onDelete = async () => {
//     setIsDeleting(true);
//     try {
//       const result = await deleteSkillApi(deleteId);
//       if (result?.data?.status === "success") {
//         toast.success(result?.data?.message || "Skill deleted successfully");
//         getSkill();
//       }
//     } catch (e) {
//       console.log(e);
//       toast.error("Failed to delete skill");
//     } finally {
//       setIsDeleting(false);
//     }
//     handleCloseDeleteDialog();
//   };

//   const onSubmit = async (data) => {
//     setIsCreating(true);
//     const payload = { label: data.skill };

//     try {
//       const result = await createSkillApi(payload);
//       if (result?.data?.status === "success") {
//         toast.success(result?.data?.message || "Skill created successfully");
//         getSkill();
//         handleClose();
//       }
//     } catch (e) {
//       console.log(e);
//       toast.error("Failed to create skill");
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const updateSkillData = async (data) => {
//     // Check if the data has actually changed
//     if (data.skill.trim() === originalSkillValue.trim()) {
//       toast.warning(
//         "No changes detected."
//       );
//       return;
//     }

//     setIsUpdating(true);
//     const payload = { label: data.skill };

//     try {
//       const result = await updateSkillApi(updateId, payload);
//       if (result?.data?.status === "success") {
//         toast.success(result?.data?.message || "Skill updated successfully");
//         getSkill();
//         handleClickCloseDialogForFormToEditManager();
//       }
//     } catch (e) {
//       console.log(e);
//       toast.error("Failed to update skill");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <Stack sx={{ p: 4 }}>
//       <CommonTable
//         rows={rows}
//         columns={columns}
//         count={totalPages} // Total pages for pagination
//         page={page}
//         onPageChange={handlePageChange}
//         onSearchChange={handleSearchChange}
//         searchValue={search}
//         loading={isLoading}
//         title="Leave Management"
//         searchPlaceholder="Search Name..."
//         noDataMessage="No Leave found"
//         showSearch={true}
//         showActionButton={true}
//         actionButtonText="Add Leave"
//         onActionClick={handleClickOpen}
//         // Pagination props
//         rowsPerPage={limit}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         showRowsPerPage={true}
//         rowsPerPageOptions={[5, 10, 25, 50]}
//         totalRows={totalCount} // Total records count
//         currentPageRows={rows?.length}
//       />

//       {/* Create Dialog */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogTitle>Add Leave</DialogTitle>
//           <DialogContent>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               {/* Start Date */}
//               <Controller
//                 name="startDate"
//                 control={control}
//                 rules={{ required: "Start Date is required" }}
//                 render={({ field }) => (
//                   <DatePicker
//                     label="Start Date"
//                     value={field.value || null}
//                     onChange={(date) => field.onChange(date)}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         margin: "dense",
//                         error: !!errors.startDate,
//                         helperText: errors.startDate?.message,
//                       },
//                     }}
//                   />
//                 )}
//               />

//               {/* End Date */}
//               <Controller
//                 name="endDate"
//                 control={control}
//                 rules={{ required: "End Date is required" }}
//                 render={({ field }) => (
//                   <DatePicker
//                     label="End Date"
//                     value={field.value || null}
//                     onChange={(date) => field.onChange(date)}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         margin: "dense",
//                         sx: { mt: 2 },
//                         error: !!errors.endDate,
//                         helperText: errors.endDate?.message,
//                       },
//                     }}
//                   />
//                 )}
//               />
//             </LocalizationProvider>

//             {/* Notes */}
//             <TextField
//               margin="dense"
//               label="Notes"
//               multiline
//               rows={3}
//               fullWidth
//               variant="outlined"
//               sx={{ mt: 2 }}
//               {...register("notes", {
//                 maxLength: {
//                   value: 300,
//                   message: "Notes must be less than 300 characters",
//                 },
//               })}
//               error={!!errors.notes}
//               helperText={errors.notes?.message}
//             />
//           </DialogContent>

//           <DialogActions>
//             <Button
//               onClick={handleClose}
//               sx={{ fontSize: "16px", color: "black" }}
//               disabled={isCreating}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isCreating}
//               variant="contained"
//               sx={{
//                 fontSize: "16px",
//                 background:
//                   "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
//                 color: "white",
//                 mx: 2,
//               }}
//             >
//               {isCreating ? (
//                 <CircularProgress size={20} color="inherit" />
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <Dialog
//         open={openUpdateDialog}
//         onClose={handleClickCloseDialogForFormToEditManager}
//         maxWidth="sm"
//         fullWidth
//       >
//         <form onSubmit={handleSubmit(updateSkillData)}>
//           <DialogTitle>Update Skill</DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               fullWidth
//               variant="outlined"
//               {...register("skill", {
//                 required: "Skill is required",
//                 minLength: {
//                   value: 2,
//                   message: "Skill must be at least 2 characters",
//                 },
//                 maxLength: {
//                   value: 50,
//                   message: "Skill must be less than 50 characters",
//                 },
//                 validate: (value) => {
//                   if (value.trim() === originalSkillValue.trim()) {
//                     return;
//                   }
//                   return true;
//                 },
//               })}
//               error={!!errors.skill}
//               helperText={errors.skill?.message}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={handleClickCloseDialogForFormToEditManager}
//               sx={{ fontSize: "16px", color: "black" }}
//               disabled={isUpdating}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isUpdating}
//               variant="contained"
//               sx={{
//                 fontSize: "16px",
//                 background:
//                   "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
//                 color: "white",
//                 mx: 2,
//               }}
//             >
//               {isUpdating ? (
//                 <CircularProgress size={20} color="inherit" />
//               ) : (
//                 "Update"
//               )}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <CommonDeleteModal
//         onClose={handleCloseDeleteDialog}
//         open={openDeleteDialog}
//         isLoading={isDeleting}
//         onClick={onDelete}
//       />
//     </Stack>
//   );
// };

// export default Page;
