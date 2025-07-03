// Updated Page component with proper totalCount-based pagination

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createDepartment,
  deleteDepartmentApi,
  getAllDepartmentApi,
  getDepartmentByIdApi,
  updateDepartmentApi,
} from "@/api";
import { toast } from "react-toastify";
import CommonDeleteModal from "@/components/CommonDelete";
import CommonTable from "@/components/CommonTable";
import moment from "moment/moment";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateId, setUpdateId] = useState([]);
  const [originalDepartmentValue, setOriginalDepartmentValue] = useState(""); // Store original value

  // Separate loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination and search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Total records count
  const [totalPages, setTotalPages] = useState(1); // Total pages

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return <Typography>{(page - 1) * limit + rowIndex + 1}</Typography>;
      },
    },
    { field: "label", headerName: "Department", flex: 1, minWidth: 140 },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography sx={{ my: 2 }}>
            {moment(date).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit department">
            <IconButton
              color="primary"
              onClick={() => handleClickOpenDialogForFormToEditTeam(params?.id)}
              size="small"
            >
              <EditIcon sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete department">
            <IconButton
              color="error"
              onClick={() => handleClickOpenDialog(params?.id)}
              size="small"
            >
              <DeleteIcon sx={{ color: "#d32f2f" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    getDepartment();
  }, [page, search, limit]);

  const getDepartment = async () => {
    setIsLoading(true);
    try {
      const result = await getAllDepartmentApi(page, limit, search);
      if (result?.data?.status === "success") {
        setRows(result.data.data.departments);

        const totalCount = result.data.data.totalCount;
        setTotalCount(totalCount);

        const calculatedTotalPages = Math.ceil(totalCount / limit);
        setTotalPages(calculatedTotalPages);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch department");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
    setPage(1); // Reset to first page when searching
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleClickOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    reset();
  };

  const handleClickOpenDialogForFormToEditTeam = async (id) => {
    setUpdateId(id);
    setOpenUpdateDialog(true);
    setIsLoading(true);
    try {
      const result = await getDepartmentByIdApi(id);
      const departmentData = result.data.data.Department;
      setValue("department", departmentData.label);
      setOriginalDepartmentValue(departmentData.label); // Store original value
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch department data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCloseDialogForFormToEditManager = () => {
    setOpenUpdateDialog(false);
    setOriginalDepartmentValue(""); // Clear original value

    reset();
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDepartmentApi(deleteId);
      if (result?.data?.status === "success") {
        toast.success(
          result?.data?.message || "department deleted successfully"
        );
        getDepartment();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
    handleCloseDeleteDialog();
  };

  const onSubmit = async (data) => {
    setIsCreating(true);
    const payload = { label: data.department };

    try {
      const result = await createDepartment(payload);
      if (result?.data?.status === "success") {
        toast.success(
          result?.data?.message || "department created successfully"
        );
        getDepartment();
        handleClose();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to create department");
    } finally {
      setIsCreating(false);
    }
  };

  const updateDepartmentData = async (data) => {
    if (data.department.trim() === originalDepartmentValue.trim()) {
      toast.warning("No changes detected.");
      return;
    }
    setIsUpdating(true);
    const payload = { label: data.department };

    try {
      const result = await updateDepartmentApi(updateId, payload);
      if (result?.data?.status === "success") {
        toast.success(
          result?.data?.message || "department updated successfully"
        );
        getDepartment();
        handleClickCloseDialogForFormToEditManager();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update department");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Stack sx={{ p: 4 }}>
      <CommonTable
        rows={rows}
        columns={columns}
        count={totalPages}
        page={page}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchValue={search}
        loading={isLoading}
        title="Department Management"
        searchPlaceholder="Search Department..."
        noDataMessage=""
        showSearch
        showActionButton
        actionButtonText="Add Department"
        onActionClick={handleClickOpen}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        showRowsPerPage
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRows={totalCount}
        currentPageRows={rows?.length}
      />

      {/* Create Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="department"
              fullWidth
              variant="outlined"
              {...register("department", {
                required: "Department is required",
                minLength: {
                  value: 2,
                  message: "Department must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Department must be less than 50 characters",
                },
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{ fontSize: "16px", color: "black" }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              variant="contained"
              sx={{
                fontSize: "16px",
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                color: "white",
                mx: 2,
              }}
            >
              {isCreating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={handleClickCloseDialogForFormToEditManager}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(updateDepartmentData)}>
          <DialogTitle>Update Department</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              fullWidth
              variant="outlined"
              {...register("department", {
                required: "department is required",
                minLength: {
                  value: 2,
                  message: "department must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "department must be less than 50 characters",
                },
                validate: (value) => {
                  if (value.trim() === originalDepartmentValue.trim()) {
                    return;
                  }
                  return true;
                },
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClickCloseDialogForFormToEditManager}
              sx={{ fontSize: "16px", color: "black" }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              variant="contained"
              sx={{
                fontSize: "16px",
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                color: "white",
                mx: 2,
              }}
            >
              {isUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CommonDeleteModal
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        isLoading={isDeleting}
        onClick={onDelete}
      />
    </Stack>
  );
};

export default Page;
