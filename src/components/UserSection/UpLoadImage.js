import React, { useEffect, useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const UpLoadImage = () => {

  const { user } = useUser();
  const { storage } = useFirebase();
  const [Avatar, setAvatar] = useState("");
  let avatarUrl;

  useEffect(() => {
    if (user) {
      const userUID = user.uid;
      const avatarRef = ref(storage, `avatars/${userUID}.jpg`);
      const prompt_txt = "warrior with sword avatar";
      
      openai.images.generate({
        model: "dall-e-3",
        prompt: prompt_txt,
        n: 1,
        size: "1024x1024",
      })
      .then((image) => {
        console.log("revised_prompt: ", image.data[0].revised_prompt);
        console.log("url: ", image.data[0].url);
        avatarUrl = image.data[0].url;

        // Check if the user already has an avatar in Firebase Storage
        getDownloadURL(avatarRef)
          .then((downloadURL) => {
            setAvatar(downloadURL);
            console.log("avatar already exists");
            console.log("Avatar URL: ", downloadURL);
          })
          .catch((error) => {
            console.error("Error getting avatar URL from Firebase Storage:", error);
          });

        // Save avatarUrl as blob to avatarRef
        fetch(avatarUrl)
          .then((response) => response.blob())
          .then((blob) => {
            uploadBytes(avatarRef, blob)
              .then(() => {
                console.log("Avatar saved to Firebase Storage.");
              })
              .catch((error) => {
                console.error("Error uploading avatar to Firebase Storage:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching avatar URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
    }
  }, [user, storage]);

  return (
 <div>
      <h1>Your Profile</h1>
      {Avatar && <img src={Avatar} alt="Random Avatar" />}
    </div>
  );
};

export default UpLoadImage;
