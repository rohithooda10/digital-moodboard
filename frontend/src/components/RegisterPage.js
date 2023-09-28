import { React, useState } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // Save user to db
        const newUser = {
          userId: user.uid,
          username: user.username,
          email: user.email,
          // password: String,
          followers: [],
          following: [],
          liked: [],
          savedPosts: [],
          createdPosts: [],
          searchHistory: [],
        };
        try {
          const response = await fetch("http://localhost:3001/users", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(newUser),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await response.json();
          console.log(json);
        } catch (error) {
          console.log("error", error);
        }
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <Wrapper>
      <BackgroundImage>
        <img src="https://images.unsplash.com/photo-1688728474617-577e621f8cbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2864&q=80" />
      </BackgroundImage>
      <RegisterForm>
        <RegisterHeading>Register</RegisterHeading>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <RegisterPageButtonsHolder>
            <RegisterButton type="submit">Register</RegisterButton>
            <LoginButton onClick={() => navigate("/login")}>Login</LoginButton>
          </RegisterPageButtonsHolder>
        </form>
      </RegisterForm>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex: 1;
  //   background-color: red;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const BackgroundImage = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: -1;
  img {
  }
`;

const RegisterHeading = styled.div`
  font-weight: 600;
  font-size: 70px;
`;

const RegisterForm = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 60%;
  width: 35%;
  justify-content: center;
  align-items: center;
  align-items: center;
  border-radius: 24px;

  form > input {
    background-color: #efefef;
    display: flex;
    height: 48px;
    width: 400px;
    border-radius: 50px;
    border: none;
    padding-left: 25px;
    margin-top: 5%;
  }
`;
const RegisterPageButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
`;
const RegisterPageButton = styled.button`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
  border: none;
  font-size: 16px;
  text-decoration: none;
  font-weight: 700;

  margin-left: 0;
  align-self: center; /* Center the button within the form */
`;
const RegisterButton = styled(RegisterPageButton)`
  background-color: black;
  color: white;
`;

const LoginButton = styled(RegisterPageButton)`
  background-color: white;
  a {
    text-decoration: none;
    font-weight: 700;
    color: black;
  }
  :hover {
    background-color: #e5e5e5;
  }
`;

export default RegisterPage;
