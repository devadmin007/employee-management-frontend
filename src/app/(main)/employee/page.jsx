"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import EmployeeDialogContent from "@/components/employeeDialogContent/page";
import { createEmployeeApi } from "@/api";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [formData, setFormData] = useState({});

  const columns = [
    { field: "x", headerName: "ID", flex: 1, minWidth: 100 },
    { field: "y", headerName: "Name", flex: 1, minWidth: 140 },
    { field: "z", headerName: "Manager", flex: 1, minWidth: 140 },
    { field: "w", headerName: "Status", flex: 1, minWidth: 140 },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // reset();
  };

  return (
    <Stack sx={{ p: 4 }}>
      <Box sx={{ textAlign: "right" }}>
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
      </Box>
      <EmployeeDialogContent open={open} onClose={handleClose} />

      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 7 } },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
    </Stack>
  );
};

export default Page;
