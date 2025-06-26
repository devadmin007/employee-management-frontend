import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

const DebaunceInput = ({
  value,
  onChange,
  delay = 500,
  label = '',
  type = 'text',
  placeholder = '',
  fullWidth = true,
  variant = 'outlined',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <TextField
      {...props}
      type={type}
      value={inputValue}
      label={label}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant={variant}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default DebaunceInput;
