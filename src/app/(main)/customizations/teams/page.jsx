"use client";

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
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import {
  createTeamApi,
  deleteTeamApi,
  getAllManagerApi,
  getAllTeamApi,
  getTeamByIdApi,
  updateTeamApi,
} from "@/api";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteModal from "@/components/CommonDelete";

const Page = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [manager, setManager] = useState([]);
  const [deleteId, setDeleteId] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateId, setUpdateId] = useState([]);

  useEffect(() => {
    getManagerArray();
    getTeam();
  }, []);

  const getManagerArray = async () => {
    setIsLoading(true);

    try {
      const result = await getAllManagerApi();
      if (result?.data?.status == "success") {
        const response = result?.data?.data;
        let temp = [];
        response.forEach((ele, index) => {
          temp.push({
            label: ele.label,
            value: ele._id,
          });
        });
        setManager(temp);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getTeam = async () => {
    try {
      const result = await getAllTeamApi();
      setIsLoading(true);
      if (result?.data?.status == "success") {
        const res = result.data.data;
        setRows(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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

  const handleClickOpenDialogForFormToEditManager = async (id) => {
    setUpdateId(id);
    setOpenUpdateDialog(true);
    try {
      const result = await getTeamByIdApi(id);
      console.log("update data ====>", result);
      const teamData = result.data.data;
      setValue("team", teamData.label);
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

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteTeamApi(deleteId);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        getTeam();
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
      label: data.name,
      managerId: data.manager,
    };
    try {
      const result = await createTeamApi(payload);
      if (result?.data?.status === "success") {
        console.log(result);
        toast.success(result?.data?.message);
        getTeam();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    handleClose();
  };

  const updateTeamData = async (data) => {
    const payload = { label: data.team };
    try {
      const result = await updateTeamApi(updateId, payload);
      console.log(result);
      getTeam();
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
      minWidth: 100,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return <Typography>{rowIndex + 1}</Typography>;
      },
    },
    { field: "value", headerName: "Name", flex: 1, minWidth: 100 },
    { field: "managerId", headerName: "Manager", flex: 1, minWidth: 100 },
    { field: "createdAt", headerName: "Created Date", flex: 1, minWidth: 100 },
    { field: "updatedAt", headerName: "Updated Date", flex: 1, minWidth: 100 },
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
          Add Team
        </Button>

        <CommonDeleteModal
          onClose={handleCloseDeleteDialog}
          open={openDeleteDialog}
          isLoading={isLoading}
          onClick={onDelete}
        />

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ width: "500px" }}>Team</DialogTitle>
            <DialogContent>
              {/* Team Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />

              {/* Manager Dropdown */}

              <Controller
                name="manager"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Manager"
                    fullWidth
                    variant="outlined"
                    error={!!errors.manager}
                    helperText={errors.manager?.message}
                    sx={{ my: 1 }}
                  >
                    {manager.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
          <form onSubmit={handleSubmit(updateTeamData)}>
            <DialogTitle sx={{ width: "500px" }}>Team</DialogTitle>
            <DialogContent>
              {/* Team Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    // label="Team Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />

              {/* Manager Dropdown */}
              <Controller
                name="manager"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    // label="Manager"
                    fullWidth
                    variant="outlined"
                    error={!!errors.manager}
                    helperText={errors.manager?.message}
                    sx={{ my: 1 }}
                  >
                    {manager.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
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
                sx={{
                  fontSize: "16px",
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                  color: "white",
                  mx: 2,
                }}
              >
                Update
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
    </Stack>
  );
};

export default Page;
