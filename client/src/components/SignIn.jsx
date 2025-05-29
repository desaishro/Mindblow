import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 14px;
  margin-top: 8px;
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateInputs = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setButtonDisabled(true);
      setError("");

      if (!validateInputs()) {
        setLoading(false);
        setButtonDisabled(false);
        return;
      }

      const response = await UserSignIn({ email, password });
      const { token, user } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Save to Redux store and localStorage
      dispatch(loginSuccess({ user, token }));
      
      // Clear form
      setEmail("");
      setPassword("");
      
      // Navigate to dashboard or home
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <div>
        <Title>Welcome to Fittrack 👋</Title>
        <Span>Please login with your details here</Span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
          name="password"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button
          text="SignIn"
          onClick={handleSignIn}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignIn;
