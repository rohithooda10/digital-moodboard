import React, { useEffect, useState } from "react";
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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserProvider } from "./context/UserContext";

function App() {
  const [user, setUser] = useState(null);
  const [posts, setNewposts] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // Unsubscribe from the observer when the component unmounts.
      unsubscribe();
    };
  }, [auth]);

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
    <React.StrictMode>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              element={
                !user ? (
                  <LoginPage />
                ) : (
                  <>
                    <Header
                      onSearch={onSearchSubmit}
                      onUserSearch={onUserSearchSubmit}
                    />
                    <MainBoard posts={posts} />
                  </>
                )
              }
            />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<RegisterPage />} />
            <Route
              exact
              path="/profile"
              element={!user ? <LoginPage /> : <Profile />}
            />
            <Route
              exact
              path="/addnewpost"
              element={!user ? <LoginPage /> : <AddNewPost />}
            />
            <Route
              exact
              path="/fullscreenpost"
              element={!user ? <LoginPage /> : <FullScreenPost />}
            />
            <Route
              exact
              path="/userssearchresult"
              element={!user ? <LoginPage /> : <UsersSearchResult />}
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </React.StrictMode>
  );
}

export default App;
