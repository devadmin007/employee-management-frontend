// Updated Page component with proper totalCount-based pagination

"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { getAllSalaryApi, getSalaryByIdApi } from "@/api";
import { toast } from "react-toastify";
import CommonTable from "@/components/CommonTable";
import { RemoveRedEye } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

const Page = () => {
  // Separate loading states
  const [isLoading, setIsLoading] = useState(false);

  // Pagination and search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Total records count
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [viewId, setViewId] = useState("");
  const [viewIdData, setViewIdData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { roleId, userId } = useAuth(); // ✅ FIXED

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
    {
      field: "employee_full_name",
      headerName: "Emp Name",
      flex: 1,
      minWidth: 140,
    },
    { field: "netSalary", headerName: "Net Salary", flex: 1, minWidth: 140 },
    { field: "month", headerName: "Month", flex: 1, minWidth: 140 },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => openDialog(params?.id)}
              size="small"
            >
              <RemoveRedEye sx={{ color: "#1976D2" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const openDialog = async (id) => {
    setViewId(id);
    setOpen(true);
    setIsViewLoading(true);
    try {
      const result = await getSalaryByIdApi(id);
      setViewIdData(result.data.data);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch salary details");
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getSalary();
  }, [page, search, limit]);

  const getSalary = async () => {
    setIsLoading(true);
    try {
      let result;

      if (roleId === "ADMIN" || roleId === "HR") {
        result = await getAllSalaryApi(page, limit, search);
      } else {
        result = await getAllSalaryApi(page, limit, search, userId);
      }

      if (result?.data?.status === "success") {
        setRows(result.data.data.data);
        const totalCount = result.data.data?.pagination?.totalCount;
        setTotalCount(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch salary");
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
  console.log(viewIdData);
  return (
    <Stack sx={{ p: 4 }}>
      <CommonTable
        rows={rows}
        columns={columns}
        count={totalCount}
        page={page}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchValue={search}
        loading={isLoading}
        title="Salary "
        searchPlaceholder="Search..."
        noDataMessage="No salary found"
        showSearch={true}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        showRowsPerPage={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRows={totalCount}
        currentPageRows={rows?.length}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: "450px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "600", fontSize: "20px" }}
        >
          Salary Data
        </DialogTitle>
        <DialogContent sx={{ minHeight: "150px" }}>
          {isViewLoading ? (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%", height: "100%" }}
            >
              <CircularProgress sx={{ color: "orange", mt: 5 }} />
            </Stack>
          ) : (
            <DialogContentText
              id="alert-dialog-description"
              sx={{ my: 1, color: "black" }}
            >
              Name: {viewIdData?.employeeId?.firstName}
              <br />
              Month: {viewIdData?.month}
              <br />
              Leave Deduction: {viewIdData?.leaveDeducation}
              <br />
              Net Salary: {viewIdData?.netSalary}
              <br />
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            disabled={isViewLoading}
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
              "Close"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Page;
