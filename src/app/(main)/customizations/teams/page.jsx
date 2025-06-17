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
      manager: "pooja",
      createdDate: "17-06-2025",
      edit: "",
      delete: "",
    },
  ]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const TeamLead = ["pawan", "pooja", "monit", "yash"];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset(); // clear form
  };

  const onSubmit = (data) => {
    const newRow = {
      id: rows.length + 1,
      name: data.name,
      manager: data.manager,
      createdDate: new Date().toLocaleDateString("en-GB"),
      edit: "",
      delete: "",
    };
    setRows((prev) => [...prev, newRow]);
    handleClose();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "manager", headerName: "Manager", width: 130 },
    { field: "createdDate", headerName: "Created Date", width: 150 },
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
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Team
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ width: "500px" }}>Team</DialogTitle>
            <DialogContent>
              {/* Team Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Team Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />

              {/* Manager Dropdown */}
              <Controller
                name="manager"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Manager"
                    fullWidth
                    variant="outlined"
                    error={!!errors.manager}
                    helperText={errors.manager?.message}
                    sx={{ my: 1 }}
                  >
                    {TeamLead.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
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
