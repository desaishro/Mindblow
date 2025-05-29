import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import TextInput from './TextInput';
import Button from './Button';

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    background: ${({ theme }) => theme.bg_secondary};
    color: ${({ theme }) => theme.text_primary};
    padding: 20px;
    min-width: 400px;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  color: ${({ theme }) => theme.text_primary};
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

const StyledFormControl = styled(FormControl)`
  & .MuiInputLabel-root {
    color: ${({ theme }) => theme.text_secondary};
  }
  & .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.text_primary};
    & fieldset {
      border-color: ${({ theme }) => theme.text_secondary + '50'};
    }
    &:hover fieldset {
      border-color: ${({ theme }) => theme.text_secondary};
    }
    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.primary};
    }
  }
  & .MuiSelect-icon {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const workoutTypes = ['HIIT', 'CARDIO', 'STRENGTH', 'YOGA', 'STRETCHING'];

const CreatePlaylistDialog = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [workoutType, setWorkoutType] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !workoutType) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ name, workoutType });
    setName('');
    setWorkoutType('');
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>Create New Playlist</StyledDialogTitle>
      <StyledDialogContent>
        <TextInput
          placeholder="Playlist Name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <StyledFormControl fullWidth>
          <InputLabel>Workout Type</InputLabel>
          <Select
            value={workoutType}
            label="Workout Type"
            onChange={(e) => setWorkoutType(e.target.value)}
          >
            {workoutTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledDialogContent>
      <DialogActions>
        <Button text="Cancel" onClick={onClose} />
        <Button text="Create" onClick={handleSubmit} />
      </DialogActions>
    </StyledDialog>
  );
};

export default CreatePlaylistDialog; 