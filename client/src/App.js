import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Blogs from "./pages/Blogs";
import Tutorials from "./pages/Tutorials";
import Music from "./pages/Music";
import BuddyMatch from './pages/BuddyMatch';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmotionalStateTracker from './components/EmotionalStateTracker';
import EmotionalStateTrends from './components/EmotionalStateTrends';
import EmotionalStateLanding from './components/EmotionalStateLanding';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} />
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/workouts" exact element={<Workouts />} />
              <Route path="/blogs" exact element={<Blogs />} />
              <Route path="/tutorials" exact element={<Tutorials />} />
              <Route path="/music" exact element={<Music />} />
              <Route path="/buddy" element={<BuddyMatch />} />
              <Route path="/mood" element={<EmotionalStateLanding />} />
              <Route path="/mood-tracker" element={<EmotionalStateTracker />} />
              <Route path="/mood-trends" element={<EmotionalStateTrends />} />
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
