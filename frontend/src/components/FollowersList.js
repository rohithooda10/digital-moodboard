import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import UserTag from "./UserTag";
import { useUser } from "../context/UserContext";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
function FollowersList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, showFollowers } = location.state || {};
  const [userList, setUserList] = useState([]);
  console.log(userId, showFollowers);

  useEffect(() => {
    // Get all users
    const fetchUserList = async () => {
      try {
        const response = await fetch("http://localhost:8080/userById", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ userId: userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        let listOfFollow = [];
        if (showFollowers) listOfFollow = json.followers;
        else listOfFollow = json.following;
        const listOfUser = [...userList];
        for (let i = 0; i < listOfFollow.length; i++) {
          try {
            const anotherUserResponse = await fetch(
              "http://localhost:8080/userById",
              {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({ userId: listOfFollow[i] }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const anotherUser = await anotherUserResponse.json();
            listOfUser.push(anotherUser);
          } catch (error) {
            console.log("error", error);
          }
        }
        setUserList([...userList, ...listOfUser]);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserList();
  }, []);

  return (
    <Wrapper>
      <HomeHeader>
        <HomePageButton>
          <a href="/">Home</a>
        </HomePageButton>
        <Heading>Users Found</Heading>
      </HomeHeader>
      <UserList>
        {userList.map((user, index) => {
          return <UserTag key={index} user={user} />;
        })}
      </UserList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.div`
  font-weight: 600;
  font-size: 50px;
  width: 100%;
  text-align: center;
  padding: 10px 0;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  //   align-items: center;
  margin-top: 20px;
`;
const Heading = styled.div`
  font-size: 30px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20px;
  font-weight: 500;
`;
const HomeHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const ProfilePageButtons = styled.div`
  display: flex;
  height: 48px;
  width: 100px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 15px;
`;
const HomePageButton = styled(ProfilePageButtons)`
  background-color: black;
  a {
    text-decoration: none;
    font-weight: 700;
    color: white;
  }
`;

export default FollowersList;
