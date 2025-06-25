"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, name: "alex", createdDate: "17-06-2025", edit: "", delete: "" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const newRow = {
      id: rows.length + 1,
      name: data.department,
      createdDate: new Date().toLocaleDateString("en-GB"), // format: dd-mm-yyyy
      edit: "",
      delete: "",
    };
    setRows([...rows, newRow]);
    handleClose();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 140 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 140,
      // renderCell: (params) => {
      //   return <Typography fontWeight={"900"}>{params?.row?.name}</Typography>;
      // },
    },
    {
      field: "createdDate",
      headerName: "Created Date",

      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Button>Hello</Button>;
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 7 };

  return (
    <Stack sx={{ p: 4 }}>
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            width: "20%",
            height: "50px",
            fontSize: {
              xs: 16,
              sm: 18,
              md: 20,
            },
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Department
        </Button>
      </Box>

      {/* Dialog with react-hook-form */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ width: "500px" }}>Departments</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Department"
              fullWidth
              variant="outlined"
              {...register("department", {
                required: "Required",
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{ fontSize: "16px", color: "black" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                fontSize: "16px",
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                color: "white",
                mx: 2,
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Table Section */}
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 520, width: "100%", p: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnSorting
            disableColumnMenu
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
    </Stack>
  );
};

export default Page;
