import React from 'react';
import { Autocomplete, TextField, Box, ListItemText } from '@mui/material';
import { CustomMenuItem } from '../../services/auth.header';



const SelectPicker = ({ options, label, value, handleChange,readOnly }) => {
  return (
    <Box>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={(event, newValue) => handleChange(newValue)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => {
          const { key, ...restProps } = props; // Extract key from props
          return (
            <CustomMenuItem {...restProps} key={key}>
              <ListItemText primary={option.label} />
            </CustomMenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            size="small" 
          />
        )}
        disabled={readOnly?readOnly:false}
      />
    </Box>
  );
};

export default SelectPicker;
