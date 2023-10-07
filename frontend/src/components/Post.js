import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
function Post({ post }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [liked, setLiked] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const likeThePost = async () => {
    loggedInUser.likedPosts.push(post.postId);
    try {
      const updatedUser = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          likedPosts: loggedInUser.likedPosts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLiked(!liked);
    } catch (error) {
      console.log("error", error);
    }
  };
  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  const unlikeThePost = async () => {
    const arr = removeItemOnce(loggedInUser.likedPosts, post.postId);
    loggedInUser.likedPosts = arr;
    try {
      const updatedUser = await fetch("http://localhost:3001/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          likedPosts: loggedInUser.likedPosts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLiked(!liked);
    } catch (error) {
      console.log("error", error);
    }
  };
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
        await setLiked(loggedInUser.likedPosts.includes(post.postId));
      } catch (error) {
        console.log("error", error);
      }
    };
    findLoggedInUser();
  }, [auth.currentUser]);
  return (
    <Wrapper>
      <Container>
        {/* ? helps us, if there is no url, it wont mess up */}
        <img
          src={!post.postType ? post.urls?.regular : post.postImageUrl}
          alt="post"
          onClick={() => {
            navigate("/fullscreenpost", { state: { post: post } });
          }}
        />
        {post.postType && (
          <LikeButton
            onClick={() => {
              if (!liked) likeThePost();
              else unlikeThePost();
            }}
          >
            <IconButton>
              {!liked && <FavoriteBorderIcon style={{ color: "white" }} />}
              {liked && <FavoriteIcon style={{ color: "white" }} />}
            </IconButton>
          </LikeButton>
        )}
      </Container>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: inline-flex;
  padding: 8px;
`;
const LikeButton = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 4;
`;
const Container = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  width: 236px;
  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: 16px;
    object-fit: cover;
  }
`;
export default Post;
