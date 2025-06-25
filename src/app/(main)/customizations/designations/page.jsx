"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import {
  createDesignation,
  deleteDesignationApi,
  deleteManagerApi,
  getAllDesignations,
  getDesignationByIdApi,
  updateDesignationApi,
} from "@/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CommonDeleteModal from "@/components/CommonDelete";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateId, setUpdateId] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,

    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const result = await getAllDesignations();
      console.log(result?.data?.data?.designations);
      const res = result.data.data.designations;
      setRows(res);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleClickOpenDialog = (id) => {
    console.log(id);
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    reset();
  };
  const onSubmit = async (data) => {
    const payload = {
      label: data.designation,
    };
    console.log(payload, "payload 56 -->");
    try {
      setIsLoading(true);
      const result = await createDesignation(payload);
      if (result?.data?.status === "success") {
        console.log(result, "60 -->");
        toast.success(result?.data?.message);
        fetchDesignations();
      }
    } catch (e) {
      console.log(e);
    } finally {
      handleClose();
      setIsLoading(false);
    }
  };

  console.log(rows);

  const deleteDesignation = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDesignationApi(deleteId);
      console.log(result);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        fetchDesignations();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
    handleCloseDeleteDialog();
  };

  const handleClickOpenDialogForFormToEditDesignation = async (id) => {
    setUpdateId(id);
    setOpenUpdateDialog(true);
    try {
      const result = await getDesignationByIdApi(id);
      console.log("update data ====>", result);
      const designationData = result.data.data.designation;
      setValue("designation", designationData.label);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCloseDialogForFormToEditManager = () => {
    setOpenUpdateDialog(false);
    reset();
  };

  const updateDesignationData = async (data) => {
    console.log(updateId);
    const payload = { label: data.designation };
    try {
      const result = await updateDesignationApi(updateId, payload);
      console.log(result);
      fetchDesignations();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      handleClickCloseDialogForFormToEditManager();
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return <Typography>{rowIndex + 1}</Typography>;
      },
    },
    { field: "label", headerName: "Name", flex: 1, minWidth: 140 },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit manager">
            <IconButton
              color="primary"
              onClick={() =>
                handleClickOpenDialogForFormToEditDesignation(params?.id)
              }
            >
              <EditIcon sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete manager">
            <IconButton
              color="error"
              onClick={() => handleClickOpenDialog(params?.id)}
            >
              <DeleteIcon sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 7 };

  return (
    <Stack sx={{ p: 4 }}>
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            minWidth: "20%",
            height: "50px",
            fontSize: { xs: 16, sm: 18, md: 20 },
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Designation
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ width: "500px" }}>Designation</DialogTitle>
            <DialogContent>
              {/* Designation Field */}
              <Controller
                name="designation"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    {...register("designation", { required: "Required" })}
                    error={!!errors.manager}
                    helperText={errors.manager?.message}
                  />
                )}
              />
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleClose}
                sx={{ fontSize: "16px", color: "black" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                sx={{
                  fontSize: "16px",
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                  color: "white",
                  mx: 2,
                }}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={openUpdateDialog}
          onClose={handleClickCloseDialogForFormToEditManager}
        >
          <form onSubmit={handleSubmit(updateDesignationData)}>
            <DialogTitle sx={{ width: "500px" }}>Manager</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                // label="manager"
                fullWidth
                variant="outlined"
                {...register("designation", { required: "Required" })}
                error={!!errors.manager}
                helperText={errors.manager?.message}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClickCloseDialogForFormToEditManager}
                sx={{ fontSize: "16px", color: "black" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                sx={{
                  fontSize: "16px",
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                  color: "white",
                  mx: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>

      <CommonDeleteModal
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        isLoading={isLoading}
        onClick={onclick}
      />
    </Stack>
  );
};

export default Page;
