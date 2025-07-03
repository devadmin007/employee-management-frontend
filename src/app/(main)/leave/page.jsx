// Updated Page component with proper totalCount-based pagination

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteModal from "@/components/CommonDelete";
import CommonTable from "@/components/CommonTable";
import AddLeave from "@/components/leave/AddLeaveModal";
import {
  approveLeave,
  createLeaveApi,
  deleteLeaveApi,
  getAllLeaveApi,
  getLeaveByIdApi,
  updateLeaveApi,
} from "@/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Chip } from "@mui/material";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Page = () => {
  const user = useSelector((state) => state.auth.userData);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [originalLeaveValue, setOriginalLeaveValue] = useState(""); // Store original value
  const [openAddLeaveModal, setOpenAddLeaveModal] = useState(false);
  // Separate loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState(null);

  // Pagination and search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Total records count
  const [totalPages, setTotalPages] = useState(1); // Total pages
  console.log("=>user", user);

  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isActionAllowed = user?.role !== "EMPLOYEE" || status === "PENDING";

  useEffect(() => {
    getLeave();
  }, [page, search, limit, statusFilter, startDate, endDate]);

  const handleStatusChange = async (id, status) => {
    try {
      let obj = {
        status: status,
      };
      console.log(obj);
      const response = await approveLeave(id, obj);
      console.log(response);
      if (response?.data?.status === "success") {
        getLeave();
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
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
        return <Typography>{(page - 1) * limit + rowIndex + 1}</Typography>;
      },
    },
    { field: "employeefullName", headerName: "Name", flex: 1, minWidth: 140 },
    {
      field: "createdAt",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            {date.toLocaleDateString("en-GB")}
          </Typography>
        );
      },
    },
    {
      field: "startDate",
      headerName: "Start Leave Date",
      flex: 1,
      minWidth: 140,

      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            {date.toLocaleDateString("en-GB")}
          </Typography>
        );
      },
    },

    {
      field: "start_leave_type",
      headerName: "Start Leave Type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const type = params.value?.toUpperCase(); // Ensure it's uppercase
        let chipProps = {
          label: type,
          variant: "outlined",
          sx: { fontWeight: 600, width: "120px" },
        };

        switch (type) {
          case "FULL_DAY":
            chipProps.color = "error"; // red
            break;
          case "FIRST_HALF":
            chipProps.color = "warning"; // orange
            break;
          case "SECOND_HALF":
            chipProps.color = "info"; // blue
            break;
          default:
            chipProps.color = "default";
            chipProps.label = type || "-";
        }

        return <Chip {...chipProps} />;
      },
    },
    {
      field: "endDate",
      headerName: "End Leave Date",
      flex: 1,
      minWidth: 140,

      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            {date.toLocaleDateString("en-GB")}
          </Typography>
        );
      },
    },

    {
      field: "end_leave_type",
      headerName: "End Leave Type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const type = params.value?.toUpperCase();
        let chipProps = {
          label: type,
          variant: "outlined",
          sx: { fontWeight: 600, width: "120px" },
        };

        switch (type) {
          case "FULL_DAY":
            chipProps.color = "error"; // red
            break;
          case "FIRST_HALF":
            chipProps.color = "warning"; // orange
            break;
          case "SECOND_HALF":
            chipProps.color = "info"; // blue
            break;
          default:
            chipProps.color = "default";
            chipProps.label = type || "-";
        }

        return <Chip {...chipProps} />;
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const status = params.row.status;
        const id = params.row._id;

        const getColor = (status) => {
          switch (status) {
            case "APPROVED":
              return "success";
            case "REJECT":
              return "error";
            case "PENDING":
              return "warning";
            default:
              return "default";
          }
        };

        if (
          (user?.role === "PROJECT_MANAGER" ||
            user?.role === "ADMIN" ||
            user?.role === "HR") &&
          status === "PENDING"
        ) {
          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Approve">
                <IconButton
                  color="success"
                  onClick={() => handleStatusChange(id, "APPROVED")}
                  size="small"
                >
                  ✅
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  color="error"
                  onClick={() => handleStatusChange(id, "REJECT")}
                  size="small"
                >
                  ❌
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }

        return (
          <Chip
            label={status}
            color={getColor(status)}
            variant="outlined"
            sx={{ fontWeight: 600, width: "110px" }}
          />
        );
      },
    },

    {
      field: "approverfullName",
      headerName: "Approver",
      flex: 1,
      minWidth: 140,
    },
    { field: "comments", headerName: "Notes", flex: 1, minWidth: 140 },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   renderCell: (params) => {
    //     const status = params.row.status;
    //     const isActionAllowed =
    //       status === "PENDING" || user?.role !== "EMPLOYEE"; // Only allow delete/edit if PENDING or user is not EMPLOYEE

    //     if (!isActionAllowed) {
    //       return <Typography sx={{ pl: 4 }}>-</Typography>;
    //     }

    //     return (
    //       <Stack direction="row" spacing={1}>
    //         <Tooltip title="Edit Leave">
    //           <IconButton
    //             color="primary"
    //             onClick={() =>
    //               handleClickOpenDialogForFormToEditTeam(params?.id)
    //             }
    //             size="small"
    //           >
    //             <EditIcon sx={{ color: "#1976D2" }} />
    //           </IconButton>
    //         </Tooltip>
    //         <Tooltip title="Cancel Leave">
    //           <IconButton
    //             color="error"
    //             onClick={() => handleClickOpenDialog(params?.id)}
    //             size="small"
    //           >
    //             <DeleteIcon sx={{ color: "#d32f2f" }} />
    //           </IconButton>
    //         </Tooltip>
    //       </Stack>
    //     );
    //   },
    // },
  ];

  if (user?.role !== "ADMIN") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        const isEmployee = user?.role === "EMPLOYEE";
        const isHRorPM =
          user?.role === "HR" || user?.role === "PROJECT_MANAGER";

        if (isEmployee) {
          if (status !== "PENDING") {
            return <Typography sx={{ pl: 4 }}>-</Typography>;
          }

          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit Leave">
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
              <Tooltip title="Cancel Leave">
                <IconButton
                  color="error"
                  onClick={() => handleClickOpenDialog(params?.id)}
                  size="small"
                >
                  <DeleteIcon sx={{ color: "#d32f2f" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }

        if (isHRorPM) {
          return <Typography sx={{ pl: 4 }}>-</Typography>;
        }

        return null;
      },
    });
  }

  const getLeave = async () => {
    setIsLoading(true);
    try {
      const role = user?.role;
      const roleFilter =
        role === "PROJECT_MANAGER" || role === "ADMIN" || role === "HR"
          ? "REQUESTED"
          : "";

      const result = await getAllLeaveApi(
        page,
        limit,
        search,
        roleFilter,
        statusFilter,
        startDate && endDate ? startDate : "",
        startDate && endDate ? endDate : ""
      );

      if (result?.data?.status === "success") {
        setRows(result.data.data.data);
        const totalCount = result.data.data?.pagination?.totalCount || 0;
        setTotalCount(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (e) {
      console.error(e);
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

  const handleClickOpen = () => {
    setUpdateId("");
    setEditData(null);
    setOpenAddLeaveModal(true);
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
    setIsLoading(true);
    try {
      const result = await getLeaveByIdApi(id);
      if (result?.data?.status === "success") {
        setOpenAddLeaveModal(true);
        setEditData(result?.data?.data);
      }
      // const leaveData = result.data.data.data;
      // setValue("leave", leaveData.label);
      // setOriginalLeaveValue(leaveData.label); // Store original value
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCloseDialogForFormToEditManager = () => {
    setOpenUpdateDialog(false);
    setOriginalLeaveValue("");
    reset();
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteLeaveApi(deleteId);
      console.log(result);
      if (result?.data?.status === "success") {
        toast.success("Leave cancelled successfully");
        getLeave();
        handleCloseDeleteDialog();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeaveData = async (data) => {
    // Check if the data has actually changed
    if (data.leave.trim() === originalLeaveValue.trim()) {
      toast.warning("No changes detected.");
      return;
    }

    setIsUpdating(true);
    const finalTypes = { ...data.dateRangeTypes };

    // Ensure each non-weekend date has a type, defaulting to "Full_DAY"
    dateRange.forEach((date) => {
      if (!isWeekend(date) && !finalTypes[date]) {
        finalTypes[date] = "FULL_DAY";
      }
    });

    // Convert into desired array format
    const leaveData = Object.entries(finalTypes)
      .filter(([_, type]) => type !== "") // remove empty selections
      .map(([date, leave_type]) => ({
        date,
        leave_type,
      }));

    const payload = {
      comments: data.notes,
      date: leaveData, // <- now this is array of { date, leaveType }
    };

    try {
      const result = await updateLeaveApi(updateId, payload);
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "leave updated successfully");
        getLeave();
        handleClickCloseDialogForFormToEditManager();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update leave");
    } finally {
      setIsUpdating(false);
    }
  };

  const onCloseAddLeaveModal = () => {
    setOpenAddLeaveModal(false);
  };

  const leaveFilters = (
    <Box sx={{  width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                sx={{ minWidth: "100px" }}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECT">Reject</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              format="DD/MM/YYYY"
              value={startDate ? dayjs(startDate) : null}
              onChange={(date) => {
                setStartDate(date ? date.format("YYYY-MM-DD") : "");
                setPage(1);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              format="DD/MM/YYYY"
              value={endDate ? dayjs(endDate) : null}
              onChange={(date) => {
                setEndDate(date ? date.format("YYYY-MM-DD") : "");
                setPage(1);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Clear Filters">
              <Button
                onClick={() => {
                  setStatusFilter("");
                  setStartDate("");
                  setEndDate("");
                  setSearch("");
                  setPage(1);
                }}
                variant="contained"
                fullWidth
                sx={{
                  height: 40,
                  fontSize: 16,
                  textTransform: "none",
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgb(229, 121, 19) 0%, rgb(235, 124, 45) 27%, rgb(234, 111, 46) 100%)",
                  },
                }}
              >
                Clear Filter
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );

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
      loading={isLoading} // This controls the internal loader of CommonTable
      title="Leave Management"
      searchPlaceholder="Search Name..."
      noDataMessage=""
      showSearch
      showActionButton
      actionButtonText="Apply Leave"
      onActionClick={handleClickOpen}
      rowsPerPage={limit}
      onRowsPerPageChange={handleRowsPerPageChange}
      showRowsPerPage
      rowsPerPageOptions={[5, 10, 25, 50]}
      totalRows={totalCount}
      currentPageRows={rows?.length}
      filterComponent={leaveFilters}
    />

    <AddLeave
      open={openAddLeaveModal}
      onClose={onCloseAddLeaveModal}
      getLeave={getLeave}
      editData={editData}
      setUpdateId={setUpdateId}
    />

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
