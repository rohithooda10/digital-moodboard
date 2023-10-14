import { React, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
function AddNewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };
  function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const imageRef = ref(storage, `image/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      console.log("Image uploaded on Firebase storage, getting URL...");
      const downloadURL = await getDownloadURL(imageRef);
      console.log(downloadURL);

      // Details to be put in the database
      // Post to database
      const newPost = {
        postId: v4(),
        userId: auth.currentUser.uid,
        postedAt: Date.now(),
        title: title,
        description: description,
        comments: [],
        postImageUrl: downloadURL,
        postType: "Created",
      };
      try {
        const response = await fetch("http://localhost:8080/posts", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(newPost),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.log("error", error);
      }

      // Reset everything
      setTitle("");
      setDescription("");
      setImageUpload(null);
      // Delay the success message for a moment
      setLoading(false);
      await wait(2000);

      // Display the success message
      setSuccess(true);

      // Navigate after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      // Handle the error appropriately
    }
  };

  return (
    <Wrapper>
      {loading && <Loading>Loading..</Loading>}
      {success && <SuccessMessage>Posted</SuccessMessage>}
      <HomeHeader>
        <HomePageButton>
          <a href="/">Home</a>
        </HomePageButton>
        <Heading>Add New Post</Heading>
      </HomeHeader>
      <NewPinCard>
        <UploadInputContainer>
          <UploadInput
            type="file"
            onChange={handleFileChange}
            required={true}
            id="file-input" // Add an ID to associate with the label
          />
          <Label htmlFor="file-input">
            {!localImageUrl && "Choose File"}
            {localImageUrl && (
              <img
                alt="upload"
                src={localImageUrl}
                style={{ height: "100%", width: "100%" }}
              />
            )}
          </Label>
        </UploadInputContainer>
        <PostDetails>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              onChange={(evnt) => setTitle(evnt.target.value)}
              value={title}
            />
            <textarea
              type="text"
              placeholder="Description"
              onChange={(evnt) => setDescription(evnt.target.value)}
              value={description}
            />
            <ButtonsHolder>
              <SaveButton type="submit">Save</SaveButton>
              <CancelButton
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setImageUpload(null);
                }}
              >
                Cancel
              </CancelButton>
            </ButtonsHolder>
          </form>
        </PostDetails>
      </NewPinCard>
    </Wrapper>
  );
}
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
const SuccessMessage = styled.div`
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
const UploadInputContainer = styled.div`
  display: flex;
  height: 70%;
  width: 40%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UploadInput = styled.input`
  display: none;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 5%;
  margin-left: 100px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 1px 1px 10px 1px #e5e5e5;
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-items: center;
  justify-content: center;
  align-items: center;
  //   background-color: blue;
`;
const NewPinCard = styled.div`
  display: flex;
  height: 700px;
  width: 70%;
  border-radius: 20px;
  box-shadow: 1px 1px 10px 1px #e5e5e5;
  align-items: center;
  justify-content: space-between;
  //   background-color: red;
`;

const HomeHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const AddNewPostPageButtons = styled.button`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 5px;
  border: none;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
`;
const HomePageButton = styled(AddNewPostPageButtons)`
  display: flex;
  height: 48px;
  width: 100px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  margin: 15px;
  background-color: black;
  a {
    text-decoration: none;
    font-weight: 700;
    color: white;
  }
`;
const ButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 100px;
`;
const SaveButton = styled(AddNewPostPageButtons)`
  background-color: black;
  color: white;
`;
const CancelButton = styled(AddNewPostPageButtons)`
  background-color: white;
  color: black;
  :hover {
    background-color: #e5e5e5;
  }
  box-shadow: 1px 1px 10px 1px #e5e5e5;
`;
const Heading = styled.div`
  font-size: 30px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20px;
  font-weight: 500;
`;
const ImagePicker = styled.div`
  display: flex;
  height: 70%;
  width: 40%;
  background-color: #e5e5e5;
  align-items: center;
  justify-content: center;
  justify-items: center;
  margin: 5%;
  border-radius: 50px;
`;
const PostDetails = styled.div`
    display: flex;
    flex-direction: column;
    width:40%;
    margin:8%;
  }
  input, textarea {
    background-color: #efefef;
    display: flex;
    height: 48px;
    width: 100%;
    border-radius: 50px;
    border: none;
    padding-left: 25px;
    margin-top:5%;
  }
  textarea {
    border-radius: 20px;
    padding-top:15px;
    font-family:helvetica;
    height:100px;
  }
`;
export default AddNewPost;
