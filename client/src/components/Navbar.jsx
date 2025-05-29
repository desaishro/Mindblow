import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { MusicNote } from "@mui/icons-material";
import { Group } from "@mui/icons-material";
import { InsertEmoticon } from "@mui/icons-material";
import { ShowChart } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

const Nav = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.bg} 0%, ${({ theme }) => theme.primary + "20"} 100%);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  gap: 24px;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 8px;
`;

const Mobileicon = styled.div`
  display: none;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0;
  list-style: none;
  margin: 0;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "10"};
    transform: translateY(-2px);
  }

  &.active {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "20"};
    font-weight: 600;
  }

  svg {
    margin-right: 8px;
    font-size: 20px;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const TextButton = styled.div`
  padding: 8px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.primary + "10"};

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "20"};
    transform: translateY(-2px);
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 20px;
  list-style: none;
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.bg};
  position: absolute;
  top: 70px;
  right: 0;
  transition: all 0.3s ease-in-out;
  transform: ${({ isOpen }) => isOpen ? "translateX(0)" : "translateX(100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
  backdrop-filter: blur(10px);
`;

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [isOpen, setisOpen] = useState(false);
  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setisOpen(!isOpen)}>
          <Menu sx={{ color: "inherit" }} />
        </Mobileicon>
        <NavLogo to="/">
          <Logo src={LogoImg} />
          Fittrack
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/tutorials">Tutorials</Navlink>
          <Navlink to="/blogs">Blogs</Navlink>
          <Navlink to="/music">
            <MusicNote style={{ marginRight: '5px' }} />
            Music
          </Navlink>
          <Navlink to="/buddy">
            <Group style={{ marginRight: '5px' }} />
            Find Buddy
          </Navlink>
          <Navlink to="/mood">
            <InsertEmoticon style={{ marginRight: '5px' }} />
            Mood & Mental Health
          </Navlink>
          <Navlink to="/mood-trends">
            <ShowChart style={{ marginRight: '5px' }} />
            Mood Trends
          </Navlink>
        </MobileMenu>

        <NavItems>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/tutorials">Tutorials</Navlink>
          <Navlink to="/blogs">Blogs</Navlink>
          <Navlink to="/music">
            <MusicNote style={{ marginRight: '5px' }} />
            Music
          </Navlink>
          <Navlink to="/buddy">
            <Group style={{ marginRight: '5px' }} />
            Find Buddy
          </Navlink>
          <Navlink to="/mood">
            <InsertEmoticon style={{ marginRight: '5px' }} />
            Mood & Mental Health
          </Navlink>
          <Navlink to="/mood-trends">
            <ShowChart style={{ marginRight: '5px' }} />
            Mood Trends
          </Navlink>
        </NavItems>

        <UserContainer>
          <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
          <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
