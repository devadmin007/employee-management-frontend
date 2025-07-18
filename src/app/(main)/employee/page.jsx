"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import EmployeeDialogContent from "@/components/employeeDialogContent/page";
import { deleteEmployeeApi, fetchAllEmployeeDetails } from "@/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import DebaunceInput from "@/utils/DebaunceInput";
import { useDispatch } from "react-redux";
import { clearEmployeeData } from "@/redux/slice/employeeDataSlice";
import CommonDeleteModal from "@/components/CommonDelete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [formData, setFormData] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClickOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 140 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 140 },
    { field: "role", headerName: "role", flex: 1, minWidth: 140 },
    { field: "totalLeave", headerName: "Total Leave", flex: 1, minWidth: 140 },
    {
      field: "usedLeave",
      headerName: "Used Leave",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <span>{params.value ?? 0}</span>; // Show 0 if value is null or undefined
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Employee">
              <IconButton
                size="small"
                onClick={() => router.push(`/employee/${params?.id}`)}
              >
                <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Employee">
              <IconButton
                color="primary"
                onClick={() => handleEditClick(params.row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Employee">
              <IconButton
                color="error"
                onClick={() => handleClickOpenDialog(params?.id)}
              >
                <DeleteIcon sx={{ color: "#d32f2f" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const handleRowsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (searchValue) => {
    setSearchQuery(searchValue);
    setPage(1);
  };

  const handleClickOpen = () => {
    dispatch(clearEmployeeData());
    setEmployeeId("");
    setFormData({});
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (employee) => {
    setEmployeeId(employee?._id);
    setOpen(true);
  };

  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        itemsPerPage: limit,
      };
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllEmployeeDetails({ params });
      if (res && res?.data) {
        setRows(res?.data?.data?.user);
        setTotalRows(res.data.data?.totalCount || res.data.data.user?.length);
      }
    } catch (error) {
      console.error("Failed to employee", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteEmployeeApi(deleteId);
      console.log("res", result);

      if (result?.data?.status === "success") {
        toast.success(result?.data?.message || "Employee deleted successfully");
        fetchEmployee();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete Employee");
    } finally {
      setIsDeleting(false);
    }
    handleCloseDeleteDialog();
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, limit, searchQuery]);

  useEffect(() => {
    if (open === false) {
      fetchEmployee();
    }
  }, [open]);

  return (
    <Stack sx={{ p: 4 }}>
      <Box>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
            padding: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Employee Management
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box>
              <DebaunceInput
                placeholder="Search Employee..."
                variant="outlined"
                size="small"
                delay={500}
                sx={{
                  minWidth: 250,
                  maxWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              variant="contained"
              sx={{
                minWidth: "120px",
                height: "40px",
                fontSize: 16,
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                textTransform: "none",
              }}
              onClick={handleClickOpen}
            >
              Add Employee
            </Button>
          </Stack>
        </Paper>
      </Box>
      <EmployeeDialogContent
        open={open}
        onClose={handleClose}
        userId={employeeId}
        fetchEmployee={fetchEmployee}
        formData={formData}
        setFormData={setFormData}
      />

      <Box>
        <Paper sx={{ height: 340, width: "100%", p: 2 }}>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress sx={{ color: '#F47B38' }} />
            </Box>
          ) : rows.length > 0 ? (
            <DataGrid
              getRowId={(row) => row._id}
              rows={rows}
              columns={columns}
              loading={isLoading}
              pagination={false}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableRowSelectionOnClick
              hideFooter
              sx={{
                backgroundColor: "#fff",
                border: "none",
              }}
            />
          ) : (
            <Typography
              variant="h6"
              align="center"
              sx={{ color: "gray", padding: 3 }}
            >
              No Data Found
            </Typography>
          )}
        </Paper>
      </Box>

      <Box>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            p: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, totalRows)} from {totalRows} results
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={limit}
                onChange={(e) => handleRowsPerPageChange(e.target.value)}
                label="Rows per page"
              >
                {[5, 10, 25, 50].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Pagination
            page={page}
            count={Math.ceil(totalRows / limit)}
            onChange={(e, value) => setPage(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "14px",
                fontWeight: 500,
                minWidth: "32px",
                height: "32px",
              },
              "& .MuiPaginationItem-page": {
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "primary.main !important",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark !important",
                },
              },
            }}
          // showFirstButton
          // showLastButton
          // siblingCount={1}
          // boundaryCount={1}
          />
        </Paper>
      </Box>

      {openDeleteDialog && (
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
