// Updated Page component with proper totalCount-based pagination

"use client";

import React, { useEffect, useState } from "react";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
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

  useEffect(() => {
    getLeave();
  }, [page, search, limit]);

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
    { field: "employee_full_name", headerName: "Name", flex: 1, minWidth: 140 },
    {
      field: "createdAt",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return <Typography>{date.toLocaleDateString()}</Typography>;
      },
    },
    {
      field: "date",
      headerName: "Leave Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return <Typography>{date.toLocaleDateString()}</Typography>;
      },
    },

    { field: "leave_type", headerName: "Leave Type", flex: 1, minWidth: 140 },

    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   minWidth: 160,
    //   renderCell: (params) => {
    //     const status = params.row.status;
    //     const id = params.row._id;

    //     if (
    //       (user?.role === "PROJECT_MANAGER" ||
    //         user?.role === "ADMIN" ||
    //         user?.role === "HR") &&
    //       status === "PENDING"
    //     ) {
    //       return (
    //         <Stack direction="row" spacing={1}>
    //           <Tooltip title="Approve">
    //             <IconButton
    //               color="success"
    //               onClick={() => handleStatusChange(id, "APPROVED")}
    //               size="small"
    //             >
    //               ✅
    //             </IconButton>
    //           </Tooltip>
    //           <Tooltip title="Reject">
    //             <IconButton
    //               color="error"
    //               onClick={() => handleStatusChange(id, "REJECT")}
    //               size="small"
    //             >
    //               ❌
    //             </IconButton>
    //           </Tooltip>
    //         </Stack>
    //       );
    //     }

    //     return <Typography>{status}</Typography>;
    //   },
    // },
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
                  onClick={() => handleStatusChange(id, "REJECTED")}
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
      field: "approver_full_name",
      headerName: "Approver",
      flex: 1,
      minWidth: 140,
    },
    { field: "comments", headerName: "Notes", flex: 1, minWidth: 140 },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Leave">
            <IconButton
              color="primary"
              onClick={() => handleClickOpenDialogForFormToEditTeam(params?.id)}
              size="small"
            >
              <EditIcon sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="cancel leave">
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

  const getLeave = async () => {
    setIsLoading(true);
    try {
      const role = user?.role;
      const result = await getAllLeaveApi(
        page,
        limit,
        search,
        (role === "PROJECT_MANAGER" || role === "ADMIN" || role === "HR") &&
          "REQUESTED"
      );
      console.log(result);
      if (result?.data?.status === "success") {
        setRows(result.data.data.data);

        // Get totalCount from API response
        const totalCount = result.data.data.totalCount;
        setTotalCount(totalCount);

        // Calculate total pages based on totalCount and limit
        const calculatedTotalPages = Math.ceil(totalCount / limit);
        setTotalPages(calculatedTotalPages);
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

  return (
    <Stack sx={{ p: 4 }}>
      <CommonTable
        rows={rows}
        columns={columns}
        count={totalPages} // Total pages for pagination
        page={page}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchValue={search}
        loading={isLoading}
        title="Leave Management"
        searchPlaceholder="Search Name..."
        noDataMessage=""
        showSearch={true}
        showActionButton={true}
        actionButtonText="Add Leave"
        onActionClick={handleClickOpen}
        // Pagination props
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        showRowsPerPage={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRows={totalCount} // Total records count
        currentPageRows={rows?.length}
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
