import { React, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
function Post({ post }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <Wrapper>
      <Container>
        {/* ? helps us, if there is no url, it wont mess up */}
        <img
          src={post.urls?.regular}
          alt="post"
          onClick={() => {
            console.log("sending:", post);
            navigate("/fullscreenpost", { state: { post: post } });
          }}
        />
        <LikeButton
          onClick={() => {
            setLiked(!liked);
          }}
        >
          <IconButton>
            {!liked && <FavoriteBorderIcon style={{ color: "white" }} />}
            {liked && <FavoriteIcon style={{ color: "white" }} />}
          </IconButton>
        </LikeButton>
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
