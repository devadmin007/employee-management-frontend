'use client'

import React, { useState } from "react";
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
} from "@mui/material";
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

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "createdDate", headerName: "Created Date", width: 150 },
    { field: "edit", headerName: "Edit", width: 130 },
    { field: "delete", headerName: "Delete", width: 130 },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const newRow = {
      id: rows.length + 1,
      name: data.skills,
      createdDate: new Date().toLocaleDateString("en-GB"), // format: dd-mm-yyyy
      edit: "",
      delete: "",
    };
    setRows([...rows, newRow]);
    handleClose();
  };

  return (
    <Stack sx={{ p: 4 }}>
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            width: "15%",
            height: "50px",
            fontSize: { xs: 16, sm: 18, md: 20 },
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          Add Skills
        </Button>
      </Box>

      {/* Dialog using react-hook-form */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ width: "500px" }}>Skills</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Skill"
              fullWidth
              variant="outlined"
              {...register("skills", { required: "Required" })}
              error={!!errors.skills}
              helperText={errors.skills?.message}
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

      {/* DataGrid section */}
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ height: 500, width: "100%", p: 2 }}>
          <DataGrid
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
