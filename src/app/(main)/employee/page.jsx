"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import EmployeeDialogContent from "@/components/employeeDialogContent/page";
import { fetchAllEmployeeDetails } from "@/api";
import EditIcon from "@mui/icons-material/Edit";
import CommonTable from "@/components/CommonTable";
import { toast } from "react-toastify";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("firstName");
  const [order, setOrder] = useState("ASC");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // const [formData, setFormData] = useState({});

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
        return <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Employee">
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row)
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Stack >
      },
    },
  ];

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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (employee) => {
    setEmployeeId(employee?._id)
    setOpen(true);
  };


  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      const params = {};
      const res = await fetchAllEmployeeDetails({ params });
      if (res && res?.data) {
        setRows(res?.data?.data?.user)
        setTotalPages(res.data.data.totalPages);
        setTotalRows(
          res.data.data?.totalCount || res.data.data.user?.length
        );
      }
    } catch (error) {
      console.error("Failed to employee", error);
      toast.error("Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployee();
  }, [page, limit]);

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
        loading={isLoading} // Only for data fetching
        title="Employee Management"
        searchPlaceholder="Search employee..."
        noDataMessage="No Employee found"
        showSearch={true}
        showActionButton={true}
        actionButtonText="Add Employee"
        onActionClick={handleClickOpen}
        // Pagination props
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        showRowsPerPage={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRows={totalRows}
        currentPageRows={rows?.length}
      />
      {/* <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            minWidth: "15%",
            height: "50px",
            fontSize: { xs: 16, sm: 18, md: 20 },
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Employee
        </Button>
      </Box> */}
      <EmployeeDialogContent open={open} onClose={handleClose} userId={employeeId} fetchEmployee={fetchEmployee} />

      {/* <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          {isLoading ?
            (<Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress />
            </Box>) :
            employeeData.length > 0 ? (

              <DataGrid
                getRowId={(row) => row._id}
                rows={employeeData}
                columns={columns}
                loading={isLoading}
                pagination={false}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableRowSelectionOnClick
                sx={{
                  backgroundColor: "#fff",
                  border: "none",
                }}
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 7 } },
                }}
              />) : (
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "gray", padding: 3 }}
              >
                No Data Found
              </Typography>
            )}

        </Paper>
      </Box> */}
    </Stack>
  );
};

export default Page;
