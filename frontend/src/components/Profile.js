import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainBoard from "./MainBoard";
import { useUser } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const user = location.state ? location.state.user : auth.currentUser;
  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  const unfollow = async () => {
    const arr = removeItemOnce(loggedInUser.following, user.userId);
    loggedInUser.following = arr;
    try {
      const updatedUser = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          following: loggedInUser.following,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlreadyFollowing(!alreadyFollowing);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const arr = removeItemOnce(user.followers, loggedInUser.userId);
      user.followers = arr;
      const updatedFollowing = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: user.userId,
          followers: user.followers,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const follow = async () => {
    try {
      loggedInUser.following.push(user.userId);
      console.log("FOLLOWING:", loggedInUser.following);
      const updatedUser = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          following: loggedInUser.following,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlreadyFollowing(!alreadyFollowing);
    } catch (error) {
      console.log("error", error);
    }
    try {
      user.followers.push(loggedInUser.userId);
      const updatedFollowing = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: user.userId,
          followers: user.followers,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    // Get my posts
    if (user) {
      const fetchPosts = async () => {
        try {
          const response = await fetch("http://localhost:3001/postsById", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ userId: user.uid }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await response.json();
          setPosts(json);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchPosts();
    }
  }, [user]);
  useEffect(() => {
    const findLoggedInUser = async () => {
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
        const loggedInUser = json;
        setLoggedInUser(loggedInUser);
        setAlreadyFollowing(loggedInUser.following.includes(user.userId));
      } catch (error) {
        console.log("error", error);
      }
    };
    findLoggedInUser();
  }, [auth.currentUser]);

  const handleLogout = async (e) => {
    signOut(auth)
      .then(() => {
        // navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log("Error while signing out");
      });
  };
  return (
    <Wrapper>
      {!user ? (
        <Loading>Loading..</Loading>
      ) : (
        <>
          <HomeHeader>
            <HomePageButton>
              <a href="/">Home</a>
            </HomePageButton>
            <Heading>Profile</Heading>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </HomeHeader>
          <ProfileCard>
            <ProfilePicture>
              {location.state && user && (
                <img alt="dp" src={user.profilePicture} />
              )}
              {!location.state && loggedInUser && (
                <img alt="dp" src={loggedInUser.profilePicture} />
              )}
            </ProfilePicture>
            <NameHolder>{user && user.email}</NameHolder>
            <Description>
              The greatest glory in living lies not in never falling, but in
              rising every time we fall..
            </Description>
            {location.state && (
              <FollowersButton
                onClick={() => {
                  if (alreadyFollowing) unfollow();
                  else follow();
                }}
                style={{ width: "250px" }}
              >
                {alreadyFollowing ? "Following" : "Follow"}
              </FollowersButton>
            )}
            <ButtonsHolder>
              <FollowersButton>Followers</FollowersButton>
              <FollowingButton>Following</FollowingButton>
            </ButtonsHolder>
          </ProfileCard>
          {/* <PostsTypeButton>
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
      </PostsTypeButton> */}
          <PostsCard>
            {/* {postsType === "Saved" && (
          <SavedPosts>
            <MainBoard posts={[]} />
          </SavedPosts>
        )} */}
            {/* {postsType === "Created" && ( */}
            <CreatedPosts>
              <MainBoard posts={posts} />
            </CreatedPosts>
            {/* )} */}
          </PostsCard>
        </>
      )}
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
