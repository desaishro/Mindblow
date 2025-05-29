import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tabs, Tab, Avatar, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { FitnessCenter, Chat, LocationOn, Schedule } from '@mui/icons-material';
import Button from '../components/Button';
import { getBuddyMatches, getBuddyPreferences, updateBuddyPreferences } from '../api/buddy';
import { toast } from 'react-toastify';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
`;

const TabPanel = styled.div`
  display: ${props => (props.value === props.index ? 'flex' : 'none')};
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

const MatchCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bg_secondary + 20};
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bg_secondary + 40};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const Name = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 15px;
  background: ${({ theme }) => theme.bg_secondary + 60};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PreferenceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.bg_secondary + 20};
  border-radius: 10px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const BuddyMatch = () => {
  const [tabValue, setTabValue] = useState(0);
  const [matches, setMatches] = useState([]);
  const [preferences, setPreferences] = useState({
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
      locationPreference: 'Local',
      maxDistance: 50
    }
  });
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const goals = ['Weight Loss', 'Muscle Gain', 'Flexibility', 'Endurance', 'General Fitness', 'Strength'];
  const workoutTypes = ['Home Workout', 'Gym', 'Yoga', 'Running', 'Swimming', 'Cycling', 'Crossfit', 'Other'];
  const communicationTypes = ['Chat Only', 'Video Calls', 'In-Person Meetups', 'All'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const locationPreferences = ['Local', 'Remote', 'Both'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Fetching buddy data...');
      
      // Try getting preferences first
      try {
        const preferencesData = await getBuddyPreferences();
        console.log('Preferences data:', preferencesData);
        if (preferencesData) {
          setPreferences(preferencesData);
        }
      } catch (prefError) {
        console.error('Error fetching preferences:', prefError);
        // Don't throw here, still try to get matches
      }

      // Try getting matches
      try {
        const matchesData = await getBuddyMatches();
        console.log('Matches data:', matchesData);
        setMatches(matchesData || []);
      } catch (matchError) {
        console.error('Error fetching matches:', matchError);
        setMatches([]);
        toast.error('Failed to load matches. Please try again later.');
      }

    } catch (error) {
      console.error('General error in loadData:', error);
      toast.error(error.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (buddyId) => {
    // This will be implemented in the next phase
    toast.info('Connection feature coming soon!');
  };

  const handlePreferenceSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateBuddyPreferences(preferences);
      toast.success('Preferences updated successfully!');
      loadData(); // Reload matches with new preferences
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChipSelect = (field, value) => {
    setPreferences(prev => {
      // Handle nested fields (e.g., workoutTimePreference.preferredDays)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const currentValues = prev[parent]?.[child] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: newValues
          }
        };
      }
      
      // Handle top-level arrays
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  return (
    <Container>
      <h1>Fitness Buddy Matching</h1>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Find Buddies" />
        <Tab label="My Preferences" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <p>Loading matches...</p>
        ) : matches.length === 0 ? (
          <p>No matches found. Try updating your preferences!</p>
        ) : (
          matches.map((buddy) => (
            <MatchCard key={buddy._id}>
              <Avatar
                src={buddy.user.avatar}
                alt={buddy.user.name}
                sx={{ width: 80, height: 80 }}
              />
              <UserInfo>
                <Name>{buddy.user.name}</Name>
                <InfoRow>
                  <FitnessCenter />
                  <span>{buddy.experienceLevel}</span>
                </InfoRow>
                <InfoRow>
                  <Schedule />
                  <span>{`${buddy.workoutTimePreference.startTime} - ${buddy.workoutTimePreference.endTime}`}</span>
                </InfoRow>
                {buddy.location && (
                  <InfoRow>
                    <LocationOn />
                    <span>{buddy.distance ? `${Math.round(buddy.distance / 1000)}km away` : 'Remote'}</span>
                  </InfoRow>
                )}
                <TagContainer>
                  {buddy.fitnessGoals.map((goal, index) => (
                    <Tag key={index}>{goal}</Tag>
                  ))}
                </TagContainer>
                <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
                  {buddy.bio}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    text="Connect"
                    leftIcon={<Chat />}
                    onClick={() => handleConnect(buddy._id)}
                  />
                  {buddy.compatibilityScore && (
                    <span style={{ color: '#666' }}>
                      {buddy.compatibilityScore}% Match
                    </span>
                  )}
                </div>
              </UserInfo>
            </MatchCard>
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Form onSubmit={handlePreferenceSubmit}>
          <FormGroup>
            <TextField
              label="Start Time"
              type="time"
              value={preferences.workoutTimePreference.startTime}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                workoutTimePreference: {
                  ...prev.workoutTimePreference,
                  startTime: e.target.value
                }
              }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              value={preferences.workoutTimePreference.endTime}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                workoutTimePreference: {
                  ...prev.workoutTimePreference,
                  endTime: e.target.value
                }
              }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </FormGroup>

          <div>
            <InputLabel>Preferred Days</InputLabel>
            <ChipGroup>
              {days.map(day => (
                <Chip
                  key={day}
                  label={day}
                  clickable
                  color={preferences.workoutTimePreference.preferredDays?.includes(day) ? 'primary' : 'default'}
                  onClick={() => handleChipSelect('workoutTimePreference.preferredDays', day)}
                />
              ))}
            </ChipGroup>
          </div>

          <div>
            <InputLabel>Fitness Goals</InputLabel>
            <ChipGroup>
              {goals.map(goal => (
                <Chip
                  key={goal}
                  label={goal}
                  clickable
                  color={preferences.fitnessGoals?.includes(goal) ? 'primary' : 'default'}
                  onClick={() => handleChipSelect('fitnessGoals', goal)}
                />
              ))}
            </ChipGroup>
          </div>

          <div>
            <InputLabel>Workout Types</InputLabel>
            <ChipGroup>
              {workoutTypes.map(type => (
                <Chip
                  key={type}
                  label={type}
                  clickable
                  color={preferences.workoutTypes?.includes(type) ? 'primary' : 'default'}
                  onClick={() => handleChipSelect('workoutTypes', type)}
                />
              ))}
            </ChipGroup>
          </div>

          <FormGroup>
            <FormControl fullWidth>
              <InputLabel>Communication Preference</InputLabel>
              <Select
                value={preferences.communicationPreference}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  communicationPreference: e.target.value
                }))}
                label="Communication Preference"
              >
                {communicationTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={preferences.experienceLevel}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  experienceLevel: e.target.value
                }))}
                label="Experience Level"
              >
                {experienceLevels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>

          <FormGroup>
            <FormControl fullWidth>
              <InputLabel>Location Preference</InputLabel>
              <Select
                value={preferences.matchPreferences.locationPreference}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  matchPreferences: {
                    ...prev.matchPreferences,
                    locationPreference: e.target.value
                  }
                }))}
                label="Location Preference"
              >
                {locationPreferences.map(pref => (
                  <MenuItem key={pref} value={pref}>{pref}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {preferences.matchPreferences.locationPreference !== 'Remote' && (
              <TextField
                label="Max Distance (km)"
                type="number"
                value={preferences.matchPreferences.maxDistance}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  matchPreferences: {
                    ...prev.matchPreferences,
                    maxDistance: parseInt(e.target.value) || 0
                  }
                }))}
                InputProps={{ inputProps: { min: 1, max: 500 } }}
                fullWidth
              />
            )}
          </FormGroup>

          <TextField
            label="Bio"
            multiline
            rows={4}
            value={preferences.bio}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              bio: e.target.value
            }))}
            placeholder="Tell potential buddies about yourself..."
            inputProps={{ maxLength: 500 }}
            fullWidth
          />

          <Button
            text={loading ? 'Saving...' : 'Save Preferences'}
            disabled={loading}
            type="submit"
            style={{ alignSelf: 'flex-start' }}
          />
        </Form>
      </TabPanel>
    </Container>
  );
};

export default BuddyMatch; 