import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const CommonInput = ({
  label,
  value,
  onChange,
  placeholder,
  error = false,
  helperText = "",
  type = "text",
  inputProps = {},
  labelProps = {},
  helperTextProps = {},
  containerProps = {},
  useBuiltInLabel = false,
  disable = false,
  children,
  ...props
}) => {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <Box {...containerProps}>
      <TextField
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        label={label}
        error={error}
        helperText={helperText}
        disabled={disable}
        select={hasChildren}
        {...props}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "error.main" : "inherit",
          },
          ...props?.sx,
        }}
      >
        {children}
      </TextField>
    </Box>
  );
};

export default CommonInput;
