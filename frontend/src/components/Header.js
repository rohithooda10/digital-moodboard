import React, { useState } from "react";
import styled from "styled-components";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SearchIcon from "@mui/icons-material/Search";
import FaceIcon from "@mui/icons-material/Face";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header({ onSearch, onUserSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const onSearchSubmit = (evnt) => {
    evnt.preventDefault();
    // calling function in parent component (App.js),
    // We have passed onSearch function from App.js
    onSearch(searchTerm);
  };
  const onUserSearchSubmit = (evnt) => {
    evnt.preventDefault();
    // calling function in parent component (App.js),
    // We have passed onSearch function from App.js
    onUserSearch(userSearchTerm);
  };

  return (
    <Wrapper>
      <LogoWrapper>
        <PinterestIcon
          onClick={() => {
            navigate("/");
          }}
        />
      </LogoWrapper>
      {/* <HomePageButton>
        <a href="/">Home</a>
      </HomePageButton> */}
      {/* <FollowingButton>
        <a href="/">Following</a>
      </FollowingButton> */}
      <CreateButton>
        <a href="/addnewpost">Create</a>
      </CreateButton>
      <SearchWrapper>
        <SearchBarWrapper>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <form>
            <input
              type="text"
              placeholder="Find Ideas.."
              onChange={(evnt) => setSearchTerm(evnt.target.value)}
            />
            <button type="submit" onClick={onSearchSubmit}></button>
          </form>
        </SearchBarWrapper>
      </SearchWrapper>
      <UserSearchWrapper>
        <UserSearchBarWrapper>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <form>
            <input
              type="text"
              placeholder="Find Creators.."
              onChange={(evnt) => setUserSearchTerm(evnt.target.value)}
            />
            <button type="submit" onClick={onUserSearchSubmit}></button>
          </form>
        </UserSearchBarWrapper>
      </UserSearchWrapper>
      <IconWrapper>
        <IconButton>
          <FaceIcon onClick={() => navigate("/profile")} />
        </IconButton>
      </IconWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  height: 56px;
  padding: 12px 4px 4px 16px;
  background-color: white;
  color: black;
`;

const LogoWrapper = styled.div`
  .MuiSvgIcon-root {
    color: #c8232c;
    font-size: 32px;
    cursor: pointer;
  }
  margin-left: 2%;
  margin-right: 2%;
`;
// Declared common button styling here
const HomePageButtons = styled.div`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
`;
// Inherited the common styling from HomePageButton
const HomePageButton = styled(HomePageButtons)`
  background-color: black;
  a {
    text-decoration: none;
    font-weight: 700;
    color: white;
  }
`;
// Inherited the common styling from HomePageButton
const FollowingButton = styled(HomePageButtons)`
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
const CreateButton = styled(HomePageButtons)`
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
const SearchWrapper = styled.div`
  flex: 1;
`;
const SearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  height: 48px;
  width: 100%;
  border-radius: 50px;
  border: none;
  padding-left: 10px;
  form {
    display: flex;
    flex: 1;
  }
  margin-left: 2%;
  margin-right: 2%;
  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    mergin-left: 5px;
    font-size: 16px;
  }
  form > button {
    display: none;
  }
  input:focus {
    outline: none;
  }
`;
const UserSearchWrapper = styled.div`
  flex: 1;
`;
const UserSearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  height: 48px;
  width: 100%;
  margin-left: 5%;
  margin-right: 2%;
  border-radius: 50px;
  border: none;
  padding-left: 10px;
  form {
    display: flex;
    flex: 1;
  }
  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    mergin-left: 5px;
    font-size: 16px;
  }
  form > button {
    display: none;
  }
  input:focus {
    outline: none;
  }
`;
const IconWrapper = styled.div`
  margin: 20px;
  margin-left: 5%;
  margin-right: 2%;
`;
export default Header;
