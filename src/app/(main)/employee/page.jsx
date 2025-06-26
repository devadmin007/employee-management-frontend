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
import { fetchAllEmployeeDetails } from "@/api";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import DebaunceInput from "@/utils/DebaunceInput";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

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
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Employee">
              <IconButton
                color="primary"
                onClick={() => handleEditClick(params.row)}
              >
                <EditIcon />
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

  const handleClickOpen = () => setOpen(true);
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
      // toast.error("Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, limit, searchQuery]);

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
              <CircularProgress />
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
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Paper>
      </Box>
    </Stack>
  );
};

export default Page;
