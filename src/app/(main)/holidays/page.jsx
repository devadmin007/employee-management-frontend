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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import {
  createHolidayApi,
  deleteHolidayApi,
  getAllHolidayApi,
  getHolidayByIdApi,
  updateHolidayApi,
} from "@/api";
import { toast } from "react-toastify";
import CommonDeleteModal from "@/components/CommonDelete";
import CommonTable from "@/components/CommonTable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const Page = () => {
  const user = useSelector((state) => state.auth.userData);
  const isAdminOrHR = ["ADMIN", "HR"].includes(user?.role?.toUpperCase());

  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateId, setUpdateId] = useState([]);
  const [originalHolidayValue, setOriginalHolidayValue] = useState("");

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
    { field: "label", headerName: "Holiday", flex: 1, minWidth: 140 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography sx={{ my: 2 }}>
            {date.toLocaleDateString("en-GB")}
          </Typography>
        );
      },
    },
    ...(isAdminOrHR
      ? [
        {
          field: "actions",
          headerName: "Actions",
          width: 120,
          sortable: false,
          renderCell: (params) => (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit holiday">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleClickOpenDialogForFormToEditTeam(params?.id)
                  }
                  size="small"
                >
                  <EditIcon sx={{ color: "#1976D2" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete holiday">
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
      ]
      : []),
  ];

  useEffect(() => {
    getHoliday();
  }, [page, limit, search]);

  const getHoliday = async () => {
    setIsLoading(true);
    try {
      const result = await getAllHolidayApi(page, limit, search);
      if (result?.data?.status === "success") {
        setRows(result.data.data.holidays);
        const totalCount = result.data.data?.totalcount || 0;
        setTotalCount(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch holidays");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);
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
    setOpenUpdateDialog(true);
    setUpdateId(id);
    setIsLoading(true);
    try {
      const result = await getHolidayByIdApi(id);
      const holidayData = result.data.data.holiday;
      setValue("label", holidayData.label);
      setValue("date", dayjs(holidayData.date));
      setOriginalHolidayValue(holidayData.label);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch holiday data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCloseDialogForFormToEditManager = () => {
    setOpenUpdateDialog(false);
    setOriginalHolidayValue("");
    reset();
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteHolidayApi(deleteId);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Holiday deleted successfully");
        getHoliday();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete holiday");
    } finally {
      setIsDeleting(false);
    }
    handleCloseDeleteDialog();
  };

  const onSubmit = async (data) => {
    setIsCreating(true);
    const payload = { label: data.label, date: data.date };
    try {
      const result = await createHolidayApi(payload);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Holiday created successfully");
        getHoliday();
        handleClose();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to create holiday");
    } finally {
      setIsCreating(false);
    }
  };

  const updateHolidayData = async (data) => {
    if (data.label.trim() === originalHolidayValue.trim()) {
      toast.warning("No changes detected.");
      return;
    }

    setIsUpdating(true);
    const payload = { label: data.label, date: dayjs(data.date).format("YYYY-MM-DD") };

    try {
      const result = await updateHolidayApi(updateId, payload);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Holiday updated successfully");
        getHoliday();
        handleClickCloseDialogForFormToEditManager();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update holiday");
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
        title="Holidays"
        searchPlaceholder="Search holiday..."
        noDataMessage="No holiday found"
        showSearch={true}
        showActionButton={isAdminOrHR}
        actionButtonText="Add Holiday"
        onActionClick={handleClickOpen}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        showRowsPerPage={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRows={totalCount}
        currentPageRows={rows?.length}
      />

      {/* Add Dialog */}
      {isAdminOrHR && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Add Holiday</DialogTitle>

            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Label"
                fullWidth
                variant="outlined"
                {...register("label", {
                  required: "Holiday label is required",
                  minLength: {
                    value: 2,
                    message: "Label must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Label must be less than 50 characters",
                  },
                })}
                error={!!errors.label}
                helperText={errors.label?.message}
              />

              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...register("date", {
                  required: "Date is required",
                })}
                error={!!errors.date}
                helperText={errors.date?.message}
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

      )}

      {/* Edit Dialog */}
      {isAdminOrHR && (
        <Dialog
          open={openUpdateDialog}
          onClose={handleClickCloseDialogForFormToEditManager}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit(updateHolidayData)}>
            <DialogTitle>Edit Holiday</DialogTitle>

            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                  {/* Holiday Label */}
                  <Controller
                    name="label"
                    control={control}
                    rules={{
                      required: "Holiday label is required",
                      minLength: {
                        value: 2,
                        message: "Label must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Label must be less than 50 characters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Holiday Label"
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        error={!!errors.label}
                        InputLabelProps={{ shrink: true }}   // ✅ important line
                        helperText={errors.label?.message}
                      />
                    )}
                  />

                  {/* Holiday Date */}
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Holiday Date"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}   // ✅ ensure correct format
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "dense",
                            error: !!errors.date,
                            helperText: errors.date?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>

             
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleClickCloseDialogForFormToEditManager}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  background:
                    "linear-gradient(90deg, rgb(239,131,29) 0%, rgb(244,121,56) 100%)",
                  color: "white",
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
      )}


      {/* Delete Dialog */}
      {isAdminOrHR && (
        <CommonDeleteModal
          onClose={handleCloseDeleteDialog}
          open={openDeleteDialog}
          isLoading={isDeleting}
          onClick={onDelete}
        />
      )}
    </Stack>
  );
};

export default Page;
