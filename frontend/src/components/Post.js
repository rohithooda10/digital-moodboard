import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
function Post({ post }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const likeThePost = async () => {
    loggedInUser.likedPosts.push(post.postId);
    loggedInUser.recommendations.push(...post.tags);
    try {
      const updatedUser = await fetch("http://localhost:8080/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          likedPosts: loggedInUser.likedPosts,
          recommendations: loggedInUser.recommendations,
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
  const saveThePost = async () => {
    loggedInUser.savedPosts.push(post.postId);
    loggedInUser.recommendations.push(...post.tags);
    try {
      const updatedUser = await fetch("http://localhost:8080/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          savedPosts: loggedInUser.savedPosts,
          recommendations: loggedInUser.recommendations,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSaved(!saved);
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
  function removeMultiple(arr, value) {
    for (const element of value) {
      const index = arr.indexOf(element);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
    return arr;
  }
  const unlikeThePost = async () => {
    const arr = removeItemOnce(loggedInUser.likedPosts, post.postId);
    loggedInUser.likedPosts = arr;
    const newRec = removeMultiple(loggedInUser.recommendations, post.tags);
    loggedInUser.recommendations = newRec;
    try {
      const updatedUser = await fetch("http://localhost:8080/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          likedPosts: loggedInUser.likedPosts,
          recommendations: loggedInUser.recommendations,
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
  const unsaveThePost = async () => {
    const arr = removeItemOnce(loggedInUser.savedPosts, post.postId);
    loggedInUser.savedPosts = arr;
    const newRec = removeMultiple(loggedInUser.recommendations, post.tags);
    loggedInUser.recommendations = newRec;
    try {
      const updatedUser = await fetch("http://localhost:8080/updateUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userId: loggedInUser.userId,
          savedPosts: loggedInUser.savedPosts,
          recommendations: loggedInUser.recommendations,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSaved(!saved);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const findLoggedInUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/userById", {
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
        setLiked(loggedInUser.likedPosts.includes(post.postId));
        setSaved(loggedInUser.savedPosts.includes(post.postId));
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
        {post.postType && post.userId != auth.currentUser.uid && (
          <>
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
            <SaveButton
              onClick={() => {
                if (!saved) saveThePost();
                else unsaveThePost();
              }}
            >
              <IconButton>
                {!saved && <BookmarkBorderIcon style={{ color: "white" }} />}
                {saved && <BookmarkIcon style={{ color: "white" }} />}
              </IconButton>
            </SaveButton>
          </>
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
const SaveButton = styled.div`
  position: absolute;
  right: 0;
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
