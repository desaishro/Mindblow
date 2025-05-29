import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api";
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

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handelSignUp = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setButtonDisabled(true);
      
      const response = await UserSignUp({ name, email, password });
      
      if (response && response.data) {
        dispatch(loginSuccess(response.data));
        alert("Account Created Successfully!");
        navigate("/dashboard");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong during signup";
      alert(errorMessage);
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <div>
        <Title>Create New Account 👋</Title>
        <Span>Please enter details to create a new account</Span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Full name"
          placeholder="Enter your full name"
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text="SignUp"
          onClick={handelSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignUp;
