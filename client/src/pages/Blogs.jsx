import React from "react";
import styled from "styled-components";
import { FitnessCenter, Timer, Restaurant, Favorite } from "@mui/icons-material";

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
  margin-bottom: 20px;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const BlogCard = styled.div`
  background: ${({ theme }) => theme.bg_secondary};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BlogTitle = styled.h3`
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 10px;
`;

const BlogExcerpt = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme, color }) => color + "20"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;

  svg {
    color: ${({ color }) => color};
    font-size: 24px;
  }
`;

const blogs = [
  {
    id: 1,
    title: "The Ultimate Guide to Building Muscle",
    excerpt: "Learn the science behind muscle growth and the most effective training methods for building lean muscle mass.",
    category: "Training",
    readTime: "8 min read",
    icon: <FitnessCenter />,
    color: "#4CAF50"
  },
  {
    id: 2,
    title: "Optimizing Your Workout Recovery",
    excerpt: "Discover essential recovery techniques to prevent injury and maximize your training results.",
    category: "Recovery",
    readTime: "6 min read",
    icon: <Timer />,
    color: "#2196F3"
  },
  {
    id: 3,
    title: "Nutrition Tips for Maximum Performance",
    excerpt: "Expert advice on fueling your workouts and achieving your fitness goals through proper nutrition.",
    category: "Nutrition",
    readTime: "10 min read",
    icon: <Restaurant />,
    color: "#FF9800"
  },
  {
    id: 4,
    title: "Mental Health Benefits of Exercise",
    excerpt: "Explore how regular exercise can improve your mental well-being and reduce stress levels.",
    category: "Wellness",
    readTime: "7 min read",
    icon: <Favorite />,
    color: "#E91E63"
  },
  {
    id: 5,
    title: "HIIT vs Steady-State Cardio",
    excerpt: "Compare different cardio approaches and find out which one is best for your fitness goals.",
    category: "Training",
    readTime: "9 min read",
    icon: <Timer />,
    color: "#4CAF50"
  },
  {
    id: 6,
    title: "Meal Prep for Fitness Success",
    excerpt: "Learn how to prepare healthy meals in advance to support your fitness journey.",
    category: "Nutrition",
    readTime: "8 min read",
    icon: <Restaurant />,
    color: "#FF9800"
  }
];

const Blogs = () => {
  return (
    <Container>
      <Title>Fitness Blog</Title>
      <BlogGrid>
        {blogs.map((blog) => (
          <BlogCard key={blog.id}>
            <IconContainer color={blog.color}>
              {blog.icon}
            </IconContainer>
            <BlogTitle>{blog.title}</BlogTitle>
            <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
            <BlogMeta>
              <span style={{ color: blog.color }}>{blog.category}</span>
              • {blog.readTime}
            </BlogMeta>
          </BlogCard>
        ))}
      </BlogGrid>
    </Container>
  );
};

export default Blogs; 