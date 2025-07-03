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
    setUpdateId(id);
    setOpenUpdateDialog(true);
    setIsLoading(true);
    try {
      const result = await getHolidayByIdApi(id);
      const holidayData = result.data.data.holiday;
      setValue("holiday", holidayData.label);
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
    const payload = { label: data.holiday, date: data.date };
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
    if (data.holiday.trim() === originalHolidayValue.trim()) {
      toast.warning("No changes detected.");
      return;
    }

    setIsUpdating(true);
    const payload = { label: data.holiday, date: data.date };

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
          {/* Form content */}
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
          {/* Form content */}
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
