import { async } from "@firebase/util";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../context/UserContext";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function UserTag({ user }) {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser && user.email === auth.currentUser.email) {
      setIsCurrentUser(true);
    }
  }, [auth.currentUser, user]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3001/userById", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ userId: auth.currentUser.uid }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      json[0].following.push(user.uid);
      const updatedUser = await fetch("http://localhost:3001/userById", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ json }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Wrapper onClick={() => navigate("/profile", { state: { user: user } })}>
      <UserDetails>
        <img
          alt="dp"
          src={
            user.profilePicture
              ? user.profilePicture
              : "https://www.unclutchgoa.com/wp-content/uploads/p11_11zon.jpg"
          }
        />
        <UserText>
          <UserName>{user.email}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserText>
      </UserDetails>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  margin: 10px;
  padding: 10px;
  height: 100px;
  width: 450px;
  flex-direction: column;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 1px 1px 11px 1px #e5e5e5;
  padding: 20px;
  justify-content: center;
  img {
    display: flex;
    height: 40px;
    width: 40px;
    cursor: zoom-in;
    border-radius: 40px;
    padding: 10px;
  }
`;
const UserDetails = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const UserText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 22px;
  padding-bottom: 5px;
`;

const UserEmail = styled.div`
  font-size: 15px;
`;

const FollowingButton = styled.div`
  display: flex;
  height: 48px;
  min-width: 90px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
  background-color: black;

  text-decoration: none;
  font-weight: 700;
  color: white;
`;

export default UserTag;
