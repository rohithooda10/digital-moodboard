import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainBoard from "./MainBoard";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsType, setPostsType] = useState("Created");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  onAuthStateChanged(auth, (loggedInUser) => {
    if (loggedInUser) {
      setUser(auth.currentUser);
    }
  });
  useEffect(() => {
    // Get my posts

    console.log(auth.currentUser);
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/postsById", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ userId: auth.currentUser.uid }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        console.log(json);
        setPosts(json);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPosts();
  }, [auth.currentUser]);
  const handleLogout = async (e) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.log("Error while signing out");
      });
  };
  return (
    <Wrapper>
      {/* {loading && <Loading>Loading..</Loading>} */}
      <HomeHeader>
        <HomePageButton>
          <a href="/">Home</a>
        </HomePageButton>
        <Heading>Profile</Heading>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </HomeHeader>
      <ProfileCard>
        <ProfilePicture>
          <img src="https://images.unsplash.com/photo-1688728474617-577e621f8cbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80" />
        </ProfilePicture>
        <NameHolder>{auth.currentUser && auth.currentUser.email}</NameHolder>
        <Description>
          The greatest glory in living lies not in never falling, but in rising
          every time we fall..
        </Description>
        <ButtonsHolder>
          <FollowersButton>Followers</FollowersButton>
          <FollowingButton>Following</FollowingButton>
        </ButtonsHolder>
      </ProfileCard>
      <PostsTypeButton>
        <button
          type="submit"
          onClick={() => {
            postsType === "Saved"
              ? setPostsType("Created")
              : setPostsType("Saved");
          }}
        >
          {postsType}
          <KeyboardArrowDownIcon />
        </button>
      </PostsTypeButton>
      <PostsCard>
        {postsType === "Saved" && (
          <SavedPosts>
            <MainBoard posts={[]} />
          </SavedPosts>
        )}
        {postsType === "Created" && (
          <CreatedPosts>
            <MainBoard posts={posts} />
          </CreatedPosts>
        )}
      </PostsCard>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-items: center;
  justify-content: center;
  // background-color: blue;
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
const PostsCard = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  // background-color: red;
`;
const ButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  height: 80px;
  width: 20%;
  justify-content: space-around;
  align-items: center;
`;
const ProfileButtons = styled.div`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
`;
const FollowersButton = styled(ProfileButtons)`
  background-color: black;
  color: white;
`;
const FollowingButton = styled(ProfileButtons)`
  background-color: white;
  color: black;
  :hover {
    background-color: #e5e5e5;
  }
  box-shadow: 1px 1px 10px 1px #e5e5e5;
`;
const PostsTypeButton = styled(ProfileButtons)`
  align-self: center;
  justify-content: center;
  width: 120px;
  box-shadow: 1px 1px 10px 1px #e5e5e5;
  padding-left: 8px;
  button {
    display: flex;
    height: 80%;
    width: 80%;
    background-color: white;
    border: none;
    font-size: 15px;
    cursor: pointer;
    align-items: center;
    justify-content: space-between;
    margin-left: 5px;
    margin-right: 5px;
  }
`;
const ProfilePicture = styled.div`
  display: flex;
  height: 200px;
  width: 200px;
  border-radius: 120px;
  margin: 20px;
  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: 160px;
    object-fit: cover;
  }
  box-shadow: 1px 1px 10px 1px #e5e5e5;
`;
const NameHolder = styled.div`
  display: flex;
  height: 30px;
  width: 200px;
  background-color: white;
  justify-content: center;
  align-items: center;
  margin: 0px;
  font-weight: 700;
  font-size: 25px;
`;
const Description = styled.div`
  display: flex;
  height: 80px;
  width: 400px;
  background-color: white;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  // background-color: yellow;
`;
const SavedPosts = styled.div`
  display: flex;
  // flex: 1;
  height: 20%;
  width: 100%;
  margin-top:40%:
`;
const CreatedPosts = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
`;
const Heading = styled.div`
  font-size: 30px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20px;
  font-weight: 500;
`;
const Loading = styled.div`
  flex: 1;
  display: flex;
  position: absolute;
  height: 900px;
  width: 2000px;
  z-index: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-size: 100px;
`;
export default Profile;
