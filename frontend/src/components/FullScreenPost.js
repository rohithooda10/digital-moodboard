import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FaceIcon from "@mui/icons-material/Face";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import Comment from "./Comment";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
function FullScreenPost() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploader, setUploader] = useState(null);
  const { post } = location.state || {};

  useEffect(() => {
    const findUploader = async () => {
      try {
        const response = await fetch("http://localhost:8080/userById", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ userId: post.userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const loggedInUser = json;
        setUploader(loggedInUser);
      } catch (error) {
        console.log("error", error);
      }
    };

    findUploader();
  }, [auth.currentUser]);
  return (
    <Wrapper>
      <HomeHeader>
        <HomePageButton>
          <a href="/">Home</a>
        </HomePageButton>
        <IconButton>
          <FaceIcon onClick={() => navigate("/profile")} />
        </IconButton>
      </HomeHeader>
      <PinContainer>
        <Container>
          {/* ? helps us, if there is no url, it wont mess up */}
          <img
            src={
              post.postType != "Created"
                ? post.urls?.regular
                : post.postImageUrl
            }
            alt="pin"
          />
        </Container>
        <PinText>
          <UserInfo>
            <img
              src={
                post.postType != "Created"
                  ? post.user.profile_image.small
                  : uploader
                  ? uploader.profilePicture
                  : post.postImageUrl
              }
              alt="dp"
            />
            <UserText>
              {!post.postType ? (
                <>
                  <UserName>{post.user.username}</UserName>
                  <Timestamp>{post.user.name}</Timestamp>
                </>
              ) : (
                <>
                  <UserName>
                    {uploader ? uploader.username : "Uploader"}
                  </UserName>
                  <Timestamp>{uploader ? uploader.email : "UserId"}</Timestamp>
                </>
              )}
            </UserText>
          </UserInfo>
          <Title>
            {!post.postType
              ? post.alt_description
                ? post.alt_description
                : "Untitled"
              : post.title}
          </Title>
          <Description>
            {!post.postType
              ? post.alt_description
                ? post.alt_description
                : "No description available.."
              : post.description}
          </Description>
          <CommentsHeading>Comments</CommentsHeading>
          <Comments>
            {/* <Comment>
              <img
                src={
                  "https://images.unsplash.com/photo-1693346223929-17afbce70514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
                }
                alt="dp"
              />
              <CommentContent>
                <CommentUserName>Ankur Rai</CommentUserName>
                <CommentText>Nice pic deer!</CommentText>
              </CommentContent>
            </Comment> */}
            <Comment
              comment={{ username: "Ankur Rai", content: "Nice pic deer!" }}
            />
          </Comments>
        </PinText>
      </PinContainer>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-color: blue;
`;
const PinContainer = styled.div`
  display: flex;
  flex-driection: row;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 1px 1px 10px 1px #e5e5e5;
  width: 60%;
  min-width: 800px;
`;
const HomeHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
  // background-color: blue;
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
const LogoutButton = styled(ProfilePageButtons)`
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
const Container = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  max-width: 400px;
  overflow: hidden;

  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: 16px;
    object-fit: cover;
  }
`;
const PinText = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  // background-color: red;
  padding: 10px;
`;
const Title = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: 600;
  padding: 20px;
  padding-left: 25px;
`;
const Description = styled.div`
  display: flex;
  font-size: 16px;
  color: grey;
  padding: 20px;
  padding-left: 25px;
  padding-top: 0px;
  // min-width: 100%;
  // max-width: 100%;
  width: 100%;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  padding: 18px;
  padding-left: 25px;
  img {
    display: flex;
    height: 50px;
    width: 50px;
    cursor: zoom-in;
    border-radius: 40px;
    padding: 10px;
  }
`;
const UserText = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 600;
`;
const Timestamp = styled.div`
  display: flex;
  font-size: 14px;
  color: grey;
`;
const Comments = styled.div`
  display: flex;
  //   background-color: red;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
`;

const CommentsHeading = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: 600;
  padding: 20px;
  padding-left: 25px;
`;

export default FullScreenPost;
