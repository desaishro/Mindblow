import React, { useState } from "react";
import styled from "styled-components";
import { PlayCircle, FitnessCenter, FilterList } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 22px;
  gap: 20px;
  overflow-y: scroll;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 10px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const TutorialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const TutorialCard = styled.div`
  background: ${({ theme }) => theme.bg_secondary};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: ${({ theme }) => theme.text_secondary + "20"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayIcon = styled(PlayCircle)`
  position: absolute;
  color: white;
  font-size: 48px !important;
  opacity: 0.9;
`;

const TutorialInfo = styled.div`
  padding: 16px;
`;

const TutorialTitle = styled.h3`
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const TutorialMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  margin-bottom: 12px;
`;

const DifficultyChip = styled(Chip)`
  &.MuiChip-root {
    height: 24px;
    font-size: 12px;
  }
`;

const tutorials = [
  {
    id: 1,
    title: "Perfect Squat Form Guide",
    thumbnail: "squat-tutorial.jpg",
    duration: "12:30",
    difficulty: "Beginner",
    category: "Strength",
    views: "15K"
  },
  {
    id: 2,
    title: "Deadlift Technique Mastery",
    thumbnail: "deadlift-tutorial.jpg",
    duration: "15:45",
    difficulty: "Intermediate",
    category: "Strength",
    views: "22K"
  },
  {
    id: 3,
    title: "Complete Push-up Tutorial",
    thumbnail: "pushup-tutorial.jpg",
    duration: "8:15",
    difficulty: "Beginner",
    category: "Bodyweight",
    views: "30K"
  },
  {
    id: 4,
    title: "Advanced HIIT Workout",
    thumbnail: "hiit-tutorial.jpg",
    duration: "20:00",
    difficulty: "Advanced",
    category: "Cardio",
    views: "18K"
  },
  {
    id: 5,
    title: "Proper Bench Press Form",
    thumbnail: "bench-tutorial.jpg",
    duration: "14:20",
    difficulty: "Intermediate",
    category: "Strength",
    views: "25K"
  },
  {
    id: 6,
    title: "Full Body Stretching Routine",
    thumbnail: "stretch-tutorial.jpg",
    duration: "10:00",
    difficulty: "Beginner",
    category: "Mobility",
    views: "12K"
  }
];

const categories = ["All", "Strength", "Cardio", "Bodyweight", "Mobility"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "#4CAF50";
    case "Intermediate":
      return "#FF9800";
    case "Advanced":
      return "#f44336";
    default:
      return "#757575";
  }
};

const Tutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredTutorials = tutorials.filter((tutorial) => {
    const categoryMatch = selectedCategory === "All" || tutorial.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || tutorial.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <Container>
      <Title>Exercise Tutorials</Title>
      <FilterContainer>
        <FilterList style={{ color: "#666", marginRight: "8px" }} />
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "contained" : "outlined"}
            size="small"
            onClick={() => setSelectedCategory(category)}
            style={{ textTransform: "none" }}
          >
            {category}
          </Button>
        ))}
      </FilterContainer>
      <FilterContainer>
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "contained" : "outlined"}
            size="small"
            onClick={() => setSelectedDifficulty(difficulty)}
            style={{ textTransform: "none" }}
          >
            {difficulty}
          </Button>
        ))}
      </FilterContainer>
      <TutorialGrid>
        {filteredTutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id}>
            <ThumbnailContainer>
              <FitnessCenter style={{ fontSize: 48, opacity: 0.2 }} />
              <PlayIcon />
            </ThumbnailContainer>
            <TutorialInfo>
              <TutorialTitle>{tutorial.title}</TutorialTitle>
              <TutorialMeta>
                <span>{tutorial.duration}</span>
                <span>•</span>
                <span>{tutorial.views} views</span>
              </TutorialMeta>
              <DifficultyChip
                label={tutorial.difficulty}
                size="small"
                style={{
                  backgroundColor: getDifficultyColor(tutorial.difficulty) + "20",
                  color: getDifficultyColor(tutorial.difficulty),
                  borderRadius: "4px",
                }}
              />
            </TutorialInfo>
          </TutorialCard>
        ))}
      </TutorialGrid>
    </Container>
  );
};

export default Tutorials; 