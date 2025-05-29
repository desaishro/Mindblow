import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Chip,
  Box
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from './Button';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
`;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const fitnessGoals = ['Weight Loss', 'Muscle Gain', 'Flexibility', 'Endurance', 'General Fitness', 'Strength'];
const workoutTypes = ['Home Workout', 'Gym', 'Yoga', 'Running', 'Swimming', 'Cycling', 'Crossfit', 'Other'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
const communicationPreferences = ['Chat Only', 'Video Calls', 'In-Person Meetups', 'All'];
const locationPreferences = ['Local', 'Remote', 'Both'];

const BuddyPreferencesForm = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState({
    workoutTimePreference: {
      startTime: '09:00',
      endTime: '18:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferredDays: []
    },
    fitnessGoals: [],
    workoutTypes: [],
    communicationPreference: 'Chat Only',
    experienceLevel: 'Beginner',
    bio: '',
    matchPreferences: {
      ageRange: [18, 65],
      preferredGender: 'Any',
      locationPreference: 'Both',
      maxDistance: 50
    },
    location: {
      type: 'Point',
      coordinates: [0, 0] // Will be updated with user's location
    }
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({
              ...prev,
              location: {
                type: 'Point',
                coordinates: [position.coords.longitude, position.coords.latitude]
              }
            }));
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      workoutTimePreference: {
        ...prev.workoutTimePreference,
        [field]: value
      }
    }));
  };

  const handleMatchPreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      matchPreferences: {
        ...prev.matchPreferences,
        [field]: value
      }
    }));
  };

  const toggleDay = (day) => {
    const days = [...formData.workoutTimePreference.preferredDays];
    const index = days.indexOf(day);
    if (index === -1) {
      days.push(day);
    } else {
      days.splice(index, 1);
    }
    handleTimeChange('preferredDays', days);
  };

  const toggleArrayItem = (field, item) => {
    const items = [...formData[field]];
    const index = items.indexOf(item);
    if (index === -1) {
      items.push(item);
    } else {
      items.splice(index, 1);
    }
    handleChange(field, items);
  };

  return (
    <FormContainer>
      <Section>
        <SectionTitle>Workout Schedule</SectionTitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <TimePicker
              label="Start Time"
              value={new Date(`2000-01-01T${formData.workoutTimePreference.startTime}`)}
              onChange={(newValue) => {
                const time = newValue.toTimeString().slice(0, 5);
                handleTimeChange('startTime', time);
              }}
            />
            <TimePicker
              label="End Time"
              value={new Date(`2000-01-01T${formData.workoutTimePreference.endTime}`)}
              onChange={(newValue) => {
                const time = newValue.toTimeString().slice(0, 5);
                handleTimeChange('endTime', time);
              }}
            />
          </div>
        </LocalizationProvider>
        <ChipContainer>
          {days.map((day) => (
            <Chip
              key={day}
              label={day}
              onClick={() => toggleDay(day)}
              color={formData.workoutTimePreference.preferredDays.includes(day) ? 'primary' : 'default'}
            />
          ))}
        </ChipContainer>
      </Section>

      <Section>
        <SectionTitle>Fitness Goals</SectionTitle>
        <ChipContainer>
          {fitnessGoals.map((goal) => (
            <Chip
              key={goal}
              label={goal}
              onClick={() => toggleArrayItem('fitnessGoals', goal)}
              color={formData.fitnessGoals.includes(goal) ? 'primary' : 'default'}
            />
          ))}
        </ChipContainer>
      </Section>

      <Section>
        <SectionTitle>Workout Types</SectionTitle>
        <ChipContainer>
          {workoutTypes.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => toggleArrayItem('workoutTypes', type)}
              color={formData.workoutTypes.includes(type) ? 'primary' : 'default'}
            />
          ))}
        </ChipContainer>
      </Section>

      <Section>
        <SectionTitle>Experience Level</SectionTitle>
        <StyledFormControl fullWidth>
          <InputLabel>Experience Level</InputLabel>
          <Select
            value={formData.experienceLevel}
            label="Experience Level"
            onChange={(e) => handleChange('experienceLevel', e.target.value)}
          >
            {experienceLevels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Section>

      <Section>
        <SectionTitle>Communication Preference</SectionTitle>
        <StyledFormControl fullWidth>
          <InputLabel>Communication Preference</InputLabel>
          <Select
            value={formData.communicationPreference}
            label="Communication Preference"
            onChange={(e) => handleChange('communicationPreference', e.target.value)}
          >
            {communicationPreferences.map((pref) => (
              <MenuItem key={pref} value={pref}>{pref}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Section>

      <Section>
        <SectionTitle>Location Preferences</SectionTitle>
        <StyledFormControl fullWidth>
          <InputLabel>Location Preference</InputLabel>
          <Select
            value={formData.matchPreferences.locationPreference}
            label="Location Preference"
            onChange={(e) => handleMatchPreferenceChange('locationPreference', e.target.value)}
          >
            {locationPreferences.map((pref) => (
              <MenuItem key={pref} value={pref}>{pref}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        {formData.matchPreferences.locationPreference !== 'Remote' && (
          <Box>
            <InputLabel>Maximum Distance (km)</InputLabel>
            <Slider
              value={formData.matchPreferences.maxDistance}
              onChange={(e, value) => handleMatchPreferenceChange('maxDistance', value)}
              min={1}
              max={100}
              valueLabelDisplay="auto"
            />
          </Box>
        )}
      </Section>

      <Section>
        <SectionTitle>Bio</SectionTitle>
        <TextField
          multiline
          rows={4}
          placeholder="Tell potential buddies about yourself..."
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
      </Section>

      <Button
        text="Save Preferences"
        onClick={() => onSubmit(formData)}
        style={{ alignSelf: 'flex-start', marginTop: '20px' }}
      />
    </FormContainer>
  );
};

export default BuddyPreferencesForm; 