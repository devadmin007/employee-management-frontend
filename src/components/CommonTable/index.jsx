// CommonTable.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Button,
  Stack,
  CircularProgress,
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
  rowsPerPage = 5,
  onRowsPerPageChange,
  showRowsPerPage = false,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalRows = 0,
  currentPageRows = 0,
  filterComponent = null,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearchValue(value);

    if (searchTimer) clearTimeout(searchTimer);

    const newTimer = setTimeout(() => {
      if (onSearchChange) onSearchChange(value);
    }, searchDelay);

    setSearchTimer(newTimer);
  };

  const handleClearSearch = () => {
    setLocalSearchValue("");
    if (searchTimer) clearTimeout(searchTimer);
    if (onSearchChange) onSearchChange("");
  };

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  const shouldShowPagination = count > 1 || (showRowsPerPage && totalRows > 0);

  const CustomGridLoader = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress size={40} sx={{ color: "#F47B38" }} />
      </Box>
    );
  };
  return (
    <Box>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="flex-start"
          width="100%"
        >
          {showSearch && (
            <Box sx={{ flex: 1, maxWidth: { xs: "100%", sm: 400 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={handleSearchChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
            </Box>
          )}

          {showActionButton &&
            (actionButton || (
              <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Button
                  fullWidth={true}
                  onClick={onActionClick}
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    height: 40,
                    fontSize: 16,
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, rgb(229, 121, 19) 0%, rgb(235, 124, 45) 27%, rgb(234, 111, 46) 100%)",
                    },
                  }}
                >
                  {actionButtonText}
                </Button>
              </Box>
            ))}
        </Stack>

        {filterComponent && <Box sx={{ width: "100%" }}>{filterComponent}</Box>}
      </Paper>

      <Paper sx={{ width: "100%", p: 2, minHeight: 300 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250,
            }}
          >
            <CircularProgress size={40} sx={{ color: "#F47B38" }} />
          </Box>
        ) : (
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            sx={{
              border: 0,
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
              maxHeight: "290px",
              overflow: "auto",
            }}
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: noDataMessage,
              noResultsOverlayLabel: localSearchValue
                ? `No results for "${localSearchValue}"`
                : noDataMessage,
            }}
          />
        )}
      </Paper>

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

      {rows?.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
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
