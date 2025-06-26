import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  InputLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { toast } from "react-toastify";
import { createLeaveApi, getAllLeaveApi, updateLeaveApi } from "@/api";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const AddLeave = ({ open, onClose, getLeave, editData, setUpdateId }) => {
  console.log(editData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      notes: "",
      dateRangeTypes: {},
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [date, setDate] = useState({});

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const isWeekend = (dateStr) => {
    const day = dayjs(dateStr).day();
    return day === 0 || day === 6;
  };

  const getDateDisplay = (dateStr) => {
    const date = dayjs(dateStr);
    return date.format("DD/MM/YYYY (dddd)");
  };

  // Effect to populate form when editData is provided
  useEffect(() => {
    if (editData && open) {
      // Set the date and leave type from editData
      const editDate = dayjs(editData.date);

      setValue("startDate", editDate);
      setValue("endDate", editDate);
      setValue("notes", editData.comments || "");

      // Set the date range types for the edit date - do this after a small delay
      // to ensure the dateRange effect has run
      setTimeout(() => {
        const dateRangeTypes = {
          [editDate.format("YYYY-MM-DD")]: editData.leave_type,
        };
        setValue("dateRangeTypes", dateRangeTypes, { shouldDirty: true });
      }, 100);
    }
  }, [editData, open, setValue]);

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      dayjs(startDate).isValid() &&
      dayjs(endDate).isValid()
    ) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      if (!start.isAfter(end)) {
        const dates = [];
        let current = start;

        while (!current.isAfter(end)) {
          dates.push(current.format("YYYY-MM-DD"));
          current = current.add(1, "day");
        }

        setDateRange(dates);

        // If we're editing, preserve the existing leave type
        if (editData) {
          const editDateStr = dayjs(editData.date).format("YYYY-MM-DD");
          const updatedTypes = {};

          dates.forEach((date) => {
            if (date === editDateStr) {
              updatedTypes[date] = editData.leave_type;
            } else {
              updatedTypes[date] = isWeekend(date) ? "WEEKEND" : "";
            }
          });

          setValue("dateRangeTypes", updatedTypes, { shouldDirty: true });
        } else {
          // For new leaves, use the existing logic
          const currentTypes = getValues("dateRangeTypes") || {};
          const updatedTypes = {};

          dates.forEach((date) => {
            updatedTypes[date] =
              currentTypes[date] ?? (isWeekend(date) ? "WEEKEND" : "");
          });

          setValue("dateRangeTypes", updatedTypes, { shouldDirty: true });
        }
      }
    } else {
      setDateRange([]);
      setValue("dateRangeTypes", {});
    }
  }, [startDate, endDate, setValue, getValues, editData]);

  useEffect(() => {
    if (!open) {
      reset({
        startDate: null,
        endDate: null,
        notes: "",
        dateRangeTypes: {},
      });
      setDateRange([]);
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    const finalTypes = { ...data.dateRangeTypes };

    // Ensure each non-weekend date has a type, defaulting to "FULL_DAY"
    dateRange.forEach((date) => {
      if (!isWeekend(date) && !finalTypes[date]) {
        finalTypes[date] = "FULL_DAY";
      }
    });

    // ✅ Exclude empty and WEEKEND leave types
    const leaveData = Object.entries(finalTypes)
      .filter(([_, type]) => type !== "" && type !== "WEEKEND")
      .map(([date, leave_type]) => ({
        date,
        leave_type,
      }));

    const payload = {
      comments: data.notes,
      date: leaveData,
    };

    try {
      setIsLoading(true);
      const result = editData?._id
        ? await updateLeaveApi(editData?._id, payload)
        : await createLeaveApi(payload);

      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        getLeave();
        onClose();
        if (editData?._id) {
          setUpdateId("");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{editData ? "Edit Leave" : "Add Leave"}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2} sx={{ my: 2 }}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disablePast={!editData} // Allow past dates when editing
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "End Date is required",
                  validate: (value) => {
                    const start = watch("startDate");
                    if (start && value && dayjs(value).isBefore(dayjs(start))) {
                      return "End date cannot be before start date";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    label="End Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disablePast={!editData} // Allow past dates when editing
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>

          {dateRange.length > 0 && (
            <Paper sx={{ p: 2, my: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Leave Type for Each Date
              </Typography>
              <Grid container spacing={2}>
                {dateRange.map((date) => {
                  const isWeekendDate = isWeekend(date);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={date}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          border: "1px solid",
                          borderColor: isWeekendDate
                            ? "error.main"
                            : "grey.300",
                          opacity: isWeekendDate ? 0.8 : 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: isWeekendDate ? "bold" : "normal",
                            color: isWeekendDate
                              ? "error.main"
                              : "text.primary",
                          }}
                        >
                          {getDateDisplay(date)}
                        </Typography>

                        <FormControl fullWidth size="small" margin="dense">
                          <InputLabel id={`label-${date}`}>
                            {/* Leave Type */}
                          </InputLabel>
                          <Controller
                            name={`dateRangeTypes.${date}`}
                            control={control}
                            defaultValue={isWeekendDate ? "WEEKEND" : ""}
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`label-${date}`}
                                // label="Leave Type"
                                disabled={isWeekendDate}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                displayEmpty
                                renderValue={(selected) => {
                                  if (!selected) return "Select Leave Type";
                                  const labels = {
                                    FULL_DAY: "FULL_DAY",
                                    FIRST_HALF: " FIRST_HALF",
                                    SECOND_HALF: "SECOND_HALF",
                                    WEEKEND: "WEEKEND - Not Available",
                                  };
                                  return (
                                    labels[selected] || "Select Leave Type"
                                  );
                                }}
                              >
                                {!isWeekendDate && [
                                  <MenuItem key="empty" value="">
                                    <em>Select Leave Type</em>
                                  </MenuItem>,
                                  <MenuItem key="FULL_DAY" value="FULL_DAY">
                                    FULL_DAY
                                  </MenuItem>,
                                  <MenuItem key="FIRST_HALF" value="FIRST_HALF">
                                    FIRST_HALF
                                  </MenuItem>,
                                  <MenuItem
                                    key="SECOND_HALF"
                                    value="SECOND_HALF"
                                  >
                                    SECOND_HALF
                                  </MenuItem>,
                                ]}
                                {isWeekendDate && (
                                  <MenuItem value="WEEKEND" disabled>
                                    WEEKEND - Not Available
                                  </MenuItem>
                                )}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          )}

          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            {...register("notes", {
              maxLength: {
                value: 300,
                message: "Notes must be less than 300 characters",
              },
            })}
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              background:
                "linear-gradient(90deg, rgb(239,131,29) 0%, rgb(244,121,56) 100%)",
              color: "white",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : editData ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddLeave;
