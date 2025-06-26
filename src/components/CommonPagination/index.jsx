import React from "react";
import {
  Box,
  Paper,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const CommonPagination = ({
  page,
  count,
  onPageChange,
  rowsPerPage = 5,
  onRowsPerPageChange,
  showRowsPerPage = false,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalRows = 0,
}) => {
  const startRow = totalRows > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(page * rowsPerPage, totalRows);

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
    if (onPageChange) {
      onPageChange(1);
    }
  };

  const shouldShowPagination = count > 1 || (showRowsPerPage && totalRows > 0);

  if (!shouldShowPagination) {
    return null;
  }

  return (
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
        {totalRows > 0 && (
          <Typography variant="body2" color="text.secondary">
            Showing {startRow}-{endRow} of {totalRows} entries
          </Typography>
        )}

        {showRowsPerPage && onRowsPerPageChange && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              label="Rows per page"
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {count > 0 && (
        <Pagination
          page={page}
          count={count}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
          variant="outlined"
          shape="rounded"
          // showFirstButton
          // showLastButton
          // siblingCount={2}
          // boundaryCount={2}
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
        />
      )}
    </Paper>
  );
};

export default CommonPagination;
