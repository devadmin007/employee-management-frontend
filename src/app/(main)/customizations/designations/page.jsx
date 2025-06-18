"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "alex",
      userRole: "",
      standardPercentages: "",
      createdDate: "17-06-2025",
      edit: "",
      delete: "",
    },
  ]);
  const role = ["react", "node"];

  const { handleSubmit, control, reset, formState: { errors } } = useForm();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const newRow = {
      id: rows.length + 1,
      name: data.Designation,
      userRole: data.role,
      standardPercentages: data.standardPercentages,
      createdDate: new Date().toLocaleDateString("en-GB"),
      edit: "",
      delete: "",
    };
    setRows([...rows, newRow]);
    handleClose();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "userRole", headerName: "User Role", width: 150 },
    { field: "standardPercentages", headerName: "Standard Percentages", width: 200 },
    { field: "edit", headerName: "Edit", width: 130 },
    { field: "delete", headerName: "Delete", width: 130 },
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
            fontSize: { xs: 16, sm: 18, md: 20 },
            background: "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Designation
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ width: "500px" }}>Designation</DialogTitle>
            <DialogContent>
              {/* Designation Field */}
              <Controller
                name="Designation"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Designation"
                    fullWidth
                    variant="outlined"
                    error={!!errors.Designation}
                    helperText={errors.Designation?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />

              {/* Role Dropdown */}
              <Controller
                name="role"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Role"
                    fullWidth
                    variant="outlined"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    sx={{ my: 1 }}
                  >
                    {role.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Standard Percentages */}
              <Controller
                name="standardPercentages"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Standard Percentages"
                    fullWidth
                    variant="outlined"
                    error={!!errors.standardPercentages}
                    helperText={errors.standardPercentages?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} sx={{ fontSize: "16px", color: "black" }}>
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
      </Box>

      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
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
