import { React, useState } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const imageRef = ref(
          storage,
          `profilePictures/${imageUpload.name + v4()}`
        );
        await uploadBytes(imageRef, imageUpload);
        console.log("Image uploaded on Firebase storage, getting URL...");
        const downloadURL = await getDownloadURL(imageRef);
        await updateProfile(user, {
          photoURL: downloadURL,
        });

        // Details to be put in the database
        const newUser = {
          profilePicture: downloadURL,
          userId: user.uid,
          username: username,
          email: user.email,
          // password: String,
          followers: [],
          following: [],
          likedPosts: [],
          savedPosts: [],
          createdPosts: [],
          searchHistory: [],
        };
        try {
          const response = await fetch("http://localhost:8080/users", {
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
        <UploadInputContainer>
          <UploadInput
            type="file"
            onChange={handleFileChange}
            required={true}
            id="file-input"
          />
          <Label htmlFor="file-input">
            {!localImageUrl && "Choose File"}
            {localImageUrl && (
              <img
                alt="upload"
                src={localImageUrl}
                style={{
                  height: "100%",
                  width: "auto",
                  display: "block",
                  borderRadius: "20%",
                }}
              />
            )}
          </Label>
        </UploadInputContainer>
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
  height: 85%;
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
const UploadInputContainer = styled.div`
  display: flex;
  height: 35%;
  width: 40%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20%;
`;

const UploadInput = styled.input`
  display: none;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 5%;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 1px 1px 10px 1px #e5e5e5;
`;

export default RegisterPage;
