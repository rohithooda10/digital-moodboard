import React from "react";
import styled from "styled-components";
function Comment({ comment }) {
  return (
    <Wrapper>
      <img
        src={
          "https://images.unsplash.com/photo-1693346223929-17afbce70514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
        }
        alt="dp"
      />
      <CommentContent>
        <CommentUserName>{comment.username}</CommentUserName>
        <CommentText>{comment.content}</CommentText>
      </CommentContent>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding-left: 25px;
  img {
    display: flex;
    height: 40px;
    width: 40px;
    cursor: zoom-in;
    border-radius: 40px;
    padding: 10px;
  }
`;
const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentUserName = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const CommentText = styled.div`
  font-size: 14px;
`;
export default Comment;
