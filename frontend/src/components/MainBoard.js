import React from "react";
import styled from "styled-components";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
function MainBoard({ posts }) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Container>
        {posts.map((post, index) => {
          return (
            <Post
              key={index}
              post={post}
              onClick={() => navigate("/fullscreenpost")}
            />
          );
        })}
      </Container>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  marign-top: 15px;
`;
const Container = styled.div`
  column-count: 5;
  column-gap: 5px;
  margin: 0 auto;
  height: 100%;
  max-width: 85%;
  background-color: white;
`;
export default MainBoard;
