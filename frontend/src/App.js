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
  const [posts, setNewPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
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
  const randomizeArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };
  useEffect(() => {
    // Define a function to fetch the logged-in user
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
        setLoggedInUser(json);
      } catch (error) {
        console.log("error", error);
      }
    };
    // Fetch the logged-in user if auth.currentUser is defined
    if (auth.currentUser) {
      findLoggedInUser();
    }
  }, [auth.currentUser]);
  useEffect(() => {
    // Fetch new posts based on search terms
    const getNewPosts = async () => {
      let promises = [];
      let postData = [];
      let terms = ["ocean", "dogs"];
      terms.forEach((term) => {
        promises.push(
          getImages(term).then((res) => {
            let results = res.data.results;
            postData = postData.concat(results);
          })
        );
      });
      // Wait for all promises to resolve
      await Promise.all(promises);

      // Randomize the postData array
      // postData.sort(function (a, b) {
      //   return 0.5 - Math.random();
      // });

      // Set new posts after randomization
      setNewPosts(postData);

      // Define a function to fetch posts for the logged-in user's following
      const fetchPosts = async () => {
        if (loggedInUser) {
          const followingIds = loggedInUser.following;
          try {
            const response = await fetch("http://localhost:3001/postsById", {
              method: "POST",
              mode: "cors",
              body: JSON.stringify({ userId: followingIds }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const json = await response.json();
            console.log("Following posts:", json);

            // Combine the new posts with the posts from the logged-in user's following
            const combinedPosts = [...posts, ...json];

            // Randomize the combinedPosts array
            combinedPosts.sort(function (a, b) {
              return 0.5 - Math.random();
            });

            // Set the randomized combinedPosts as the new posts
            setNewPosts(combinedPosts);
          } catch (error) {
            console.log("error", error);
          }
        }
      };

      // Fetch posts for the logged-in user's following
      if (loggedInUser) {
        fetchPosts();
      }
    };

    // Fetch new posts based on search terms
    getNewPosts();
  }, [loggedInUser]);

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
      setNewPosts(newPosts);
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
