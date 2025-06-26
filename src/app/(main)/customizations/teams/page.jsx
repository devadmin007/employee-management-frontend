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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createTeamApi,
  deleteTeamApi,
  getAllTeamApi,
  getAllUsers,
  getTeamByIdApi,
  updateTeamApi,
} from "@/api";
import { toast } from "react-toastify";
import CommonDeleteModal from "@/components/CommonDelete";
import CommonTable from "@/components/CommonTable";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateId, setUpdateId] = useState([]);
  const [manager, setManager] = useState([]);
  const [originalTeamValue, setOriginalTeamValue] = useState(""); // Store original value

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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
    { field: "label", headerName: "Teams", flex: 1, minWidth: 140 },
    {
      field: "managerFirstName",
      headerName: "Manager",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit team">
            <IconButton
              onClick={() => handleClickOpenDialogForFormToEditTeam(params.id)}
              size="small"
            >
              <EditIcon sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete team">
            <IconButton
              onClick={() => handleClickOpenDialog(params.id)}
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
    getTeams();
  }, [page, search, limit]);

  const getTeams = async () => {
    setIsLoading(true);
    try {
      const result = await getAllTeamApi(page, limit, search);
      if (result?.data?.status === "success") {
        setRows(result.data.data.team);
        setTotalCount(result.data.data.totalCount);
        setTotalPages(Math.ceil(result.data.data.totalCount / limit));
      }
    } catch (e) {
      toast.error("Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
    setPage(1);
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
      const result = await getTeamByIdApi(id);
      const teamData = result.data.data;
      setValue("team", teamData.label);
      setValue("managerId", teamData.managerId?._id);
      setOriginalTeamValue(teamData.label); // Store original value
    } catch (e) {
      toast.error("Failed to fetch team data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCloseDialogForFormToEditManager = () => {
    setOpenUpdateDialog(false);
    setOriginalTeamValue("");
    reset();
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTeamApi(deleteId);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Team deleted successfully");
        getTeams();
      }
    } catch (e) {
      toast.error("Failed to delete team");
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const onSubmit = async (data) => {
    setIsCreating(true);
    const payload = {
      label: data.team,
      managerId: data.managerId,
    };

    try {
      const result = await createTeamApi(payload);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Team created successfully");
        getTeams();
        handleClose();
      }
    } catch (e) {
      toast.error("Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const updateTeamsData = async (data) => {
    // Check if the data has actually changed
    if (data.team.trim() === originalTeamValue.trim()) {
      toast.warning("No changes detected.");
      return;
    }
    setIsUpdating(true);
    const payload = {
      label: data.team,
      managerId: data.managerId,
    };

    try {
      const result = await updateTeamApi(updateId, payload);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Team updated successfully");
        getTeams();
        handleClickCloseDialogForFormToEditManager();
      }
    } catch (e) {
      toast.error("Failed to update team");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getManagers();
  }, []);

  const getManagers = async () => {
    try {
      const response = await getAllUsers();
      setManager(response.data.data.user);
    } catch (e) {
      console.log(e);
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
        title="Teams Management"
        searchPlaceholder="Search Team..."
        noDataMessage="No Teams found"
        showSearch
        showActionButton
        actionButtonText="Add Teams"
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
          <DialogTitle>Add New Team</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Team"
              fullWidth
              variant="outlined"
              {...register("team", {
                required: "Team is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
              error={!!errors.team}
              helperText={errors.team?.message}
            />
            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel id="manager-label">Manager</InputLabel>
              <Controller
                name="managerId"
                control={control}
                rules={{ required: "Manager is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="manager-label"
                    label="Manager"
                    error={!!errors.managerId}
                  >
                    {manager.map((mgr) => (
                      <MenuItem key={mgr._id} value={mgr._id}>
                        {mgr.firstName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.managerId && (
                <Typography color="error" variant="caption">
                  {errors.managerId.message}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isCreating}>
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

      {/* Update Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleClickCloseDialogForFormToEditManager}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(updateTeamsData)}>
          <DialogTitle>Update Team</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              fullWidth
              variant="outlined"
              {...register("team", {
                required: "Team is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
                validate: (value) => {
                  if (value.trim() === originalTeamValue.trim()) {
                    return;
                  }
                  return true;
                },
              })}
              error={!!errors.team}
              helperText={errors.team?.message}
            />
            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel id="update-manager-label">Manager</InputLabel>
              <Controller
                name="managerId"
                control={control}
                rules={{ required: "Manager is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="update-manager-label"
                    label="Manager"
                    error={!!errors.managerId}
                  >
                    {manager.map((mgr) => (
                      <MenuItem key={mgr._id} value={mgr._id}>
                        {mgr.firstName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.managerId && (
                <Typography color="error" variant="caption">
                  {errors.managerId.message}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClickCloseDialogForFormToEditManager}
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
