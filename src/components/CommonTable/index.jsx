import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CommonPagination from "../CommonPagination";

const CommonTable = ({
  rows,
  columns,
  count,
  page,
  onPageChange,
  onSearchChange,
  searchValue = "",
  loading = false,
  title = "",
  searchPlaceholder = "Search...",
  noDataMessage = "No data available",
  showSearch = true,
  searchDelay = 500,
  actionButton = null,
  onActionClick,
  actionButtonText = "Add",
  showActionButton = false,
  // Pagination props
  rowsPerPage = 5,
  onRowsPerPageChange,
  showRowsPerPage = false,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalRows = 0,
  currentPageRows = 0,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearchValue(value);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const newTimer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, searchDelay);

    setSearchTimer(newTimer);
  };

  const handleClearSearch = () => {
    setLocalSearchValue("");
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [searchTimer]);

  // Show pagination if there are multiple pages OR if showRowsPerPage is true and there's data
  const shouldShowPagination = count > 1 || (showRowsPerPage && totalRows > 0);

  return (
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
        {title && (
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        )}

        <Stack direction={"row"} spacing={3}>
          <Box>
            {showSearch && (
              <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={handleSearchChange}
                sx={{
                  minWidth: 250,
                  maxWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: localSearchValue && (
                    <InputAdornment position="end">
                      <ClearIcon
                        color="action"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "error.main" },
                        }}
                        onClick={handleClearSearch}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>

          {showActionButton &&
            (actionButton || (
              <Button
                variant="contained"
                onClick={onActionClick}
                sx={{
                  minWidth: "120px",
                  height: "40px",
                  fontSize: 16,
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgb(229, 121, 19) 0%, rgb(235, 124, 45) 27%, rgb(234, 111, 46) 100%)",
                  },
                }}
              >
                {actionButtonText}
              </Button>
            ))}
        </Stack>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 500, width: "100%", p: 2 }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={rows}
          columns={columns}
          loading={loading}
          sx={{
            border: 0,
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
          }}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooterPagination
          hideFooter
          localeText={{
            noRowsLabel: noDataMessage,
            noResultsOverlayLabel: localSearchValue
              ? `No results found for "${localSearchValue}"`
              : noDataMessage,
          }}
        />
      </Paper>

      {/* Pagination - Now with all required props */}
      {shouldShowPagination && (
        <CommonPagination
          page={page}
          count={count}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowsPerPage={showRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          totalRows={totalRows}
        />
      )}

      {/* No Data State */}
      {rows?.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">
            {localSearchValue
              ? `No results found for "${localSearchValue}"`
              : noDataMessage}
          </Typography>
          {localSearchValue && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Try adjusting your search terms
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CommonTable;
