import { React, useEffect, useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(email, password);
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/profile");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <Wrapper>
      {usersList && usersList[0] && usersList[0].username}
      <BackgroundImage>
        <img
          alt="bgImage"
          src="https://images.unsplash.com/photo-1688728474617-577e621f8cbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2864&q=80"
        />
      </BackgroundImage>
      <LoginForm>
        <LoginHeading>Login</LoginHeading>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email} // Use value to set the input value
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <input
            type="password"
            placeholder="Password"
            value={password} // Use value to set the input value
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
          <LoginPageButtonsHolder>
            <LoginButton type="submit">Login</LoginButton>
            <RegisterButton onClick={() => navigate("/register")}>
              Register
            </RegisterButton>
            {/* <a href="/register">Register</a> */}
          </LoginPageButtonsHolder>
        </form>
      </LoginForm>
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

const LoginHeading = styled.div`
  font-weight: 600;
  font-size: 70px;
`;

const LoginForm = styled.div`
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
const LoginPageButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
`;
const LoginPageButton = styled.button`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
  border: none;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;

  margin-left: 0;
  align-self: center; /* Center the button within the form */
`;
const LoginButton = styled(LoginPageButton)`
  background-color: black;
  color: white;
  border: black;
  a : {
    background-color: white;
    color: black;
    :hover {
      background-color: #e5e5e5;
    }
    box-shadow: 1px 1px 10px 1px #e5e5e5;
  }
`;

const RegisterButton = styled(LoginPageButton)`
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

export default LoginPage;
