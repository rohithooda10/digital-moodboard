import React, { Component, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import MainBoard from "./components/MainBoard";
import unsplash from "./api/unsplash";
import Profile from "./components/Profile";
import AddNewPost from "./components/AddNewPost";
import FullScreenPost from "./components/FullScreenPost";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import UsersSearchResult from "./components/UsersSearchResult";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [posts, setNewposts] = useState([]);

  useEffect(() => {
    const getNewposts = () => {
      let promises = [];
      let postData = [];
      let posts = ["ocean", "dogs"];
      posts.forEach((term) => {
        promises.push(
          getImages(term).then((res) => {
            let results = res.data.results;
            postData = postData.concat(results);
            postData.sort(function (a, b) {
              return 0.5 - Math.random();
            });
          })
        );
      });
      Promise.all(promises).then(() => {
        setNewposts(postData);
      });
    };
    getNewposts();
  }, []);
  const getImages = (searchTerm) => {
    return unsplash.get("https://api.unsplash.com/search/photos", {
      params: { query: searchTerm },
    });
  };
  const onSearchSubmit = (searchTerm) => {
    console.log("Term received:", searchTerm);
    getImages(searchTerm).then((res) => {
      let results = res.data.results;
      let newPosts = [...results, ...posts];
      newPosts.sort(function (a, b) {
        return 0.5 - Math.random();
      });
      setNewposts(newPosts);
    });
  };
  const onUserSearchSubmit = (userSearchTerm) => {
    console.log("Term received:", userSearchTerm);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Header
                  onSearch={onSearchSubmit}
                  onUserSearch={onUserSearchSubmit}
                />
                <MainBoard posts={posts} />
              </>
            }
          />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/profile" element={<Profile posts={posts} />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/addnewpost" element={<AddNewPost />} />
          <Route exact path="/fullscreenpost" element={<FullScreenPost />} />
          <Route
            exact
            path="/userssearchresult"
            element={<UsersSearchResult />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
