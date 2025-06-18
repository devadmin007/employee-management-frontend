"use client";

import { Box, Paper } from "@mui/material";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

function getWeekendDates(year) {
  const weekends = [];
  const start = new Date(`${year}-06-21`);
  const end = new Date(`${year}-12-31`);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
      weekends.push({
        id: new Date(),
        date: date.toISOString().split("T")[0], // YYYY-MM-DD
        day: day === 0 ? "Sunday" : "Saturday",
        title: "Weekend",
      });
    }
  }

  return weekends;
}

const weekendDates = getWeekendDates(2025);
const HolidaysPage = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "day", headerName: "Day", width: 130 },
    { field: "title", headerName: "Title", width: 130 },

  ];

  const paginationModel = { page: 0, pageSize: 7 };

  return (
    
    <Box sx={{ mt: 5,mx:3}}>
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={weekendDates}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
};

export default HolidaysPage;
