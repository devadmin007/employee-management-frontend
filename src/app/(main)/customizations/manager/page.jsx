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
import { useForm } from "react-hook-form";
import {
  createManagerApi,
  deleteManagerApi,
  getAllManagerApi,
  getManagerByIdApi,
  updateManagerApi,
} from "@/api";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [deleteId, setDeleteId] = useState([]);
  const [updateId, setUpdateId] = useState([]);

  const [rows, setRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

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
        return <Typography>{rowIndex + 1}</Typography>;
      },
    },
    { field: "label", headerName: "Manager Name", flex: 1, minWidth: 140 },
    { field: "createdAt", headerName: "Created Date", flex: 1, minWidth: 140 },
    { field: "updatedAt", headerName: "Updated Date", flex: 1, minWidth: 140 },
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
                handleClickOpenDialogForFormToEditManager(params?.id)
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

  useEffect(() => {
    getManager();
  }, []);

  const getManager = async () => {
    try {
      const result = await getAllManagerApi();
      setIsLoading(true);
      console.log(result);
      console.log("result====>", result.data.data);
      if (result?.data?.status == "success") {
        const res = result.data.data;
        setRows(res);
        toast.success(result?.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (id) => {
    setOpen(true);
  };

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

  const handleClickOpenDialogForFormToEditManager = async (id) => {
    setUpdateId(id);
    setOpenUpdateDialog(true);
    try {
      const result = await getManagerByIdApi(id);
      console.log("update data ====>", result);
      const managerData = result.data.data;
      setValue("manager", managerData.label);
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

  const deleteManager = async () => {
    setIsLoading(true);
    try {
      const result = await deleteManagerApi(deleteId);
      console.log(result);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        getManager();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
    handleCloseDeleteDialog();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const payload = {
      label: data.manager,
    };
    console.log(payload);
    try {
      const result = await createManagerApi(payload);
      if (result?.data?.status === "success") {
        console.log(result);
        toast.success(result?.data?.message);
        getManager();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    handleClose();
  };

  const updateManagerData = async (data) => {
    console.log(updateId);
    const payload = { label: data.manager };
    try {
      const result = await updateManagerApi(updateId, payload);
      console.log(result);
      getManager();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      handleClickCloseDialogForFormToEditManager();
    }
  };

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
          Add Manager
        </Button>
      </Box>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogContent sx={{ height: "90px" }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ width: "400px", mx: 2, my: 1, fontSize: "18px" }}
          >
            are you sure? you want to delete.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ fontSize: "16px", color: "black" }}
          >
            No
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={deleteManager}
            sx={{
              fontSize: "16px",
              background:
                "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              color: "white",
              mx: 2,
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={handleClickCloseDialogForFormToEditManager}
      >
        <form onSubmit={handleSubmit(updateManagerData)}>
          <DialogTitle sx={{ width: "500px" }}>Manager</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              // label="manager"
              fullWidth
              variant="outlined"
              {...register("manager", { required: "Required" })}
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

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ width: "500px" }}>Manager</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="manager"
              fullWidth
              variant="outlined"
              {...register("manager", { required: "Required" })}
              error={!!errors.manager}
              helperText={errors.manager?.message}
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
                "Save"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 7 } },
            }}
            disableColumnMenu
            disableColumnFilter
            disableColumnResize
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
    </Stack>
  );
};

export default Page;
