import React, { useEffect, useState } from "react";
//import { AvatarGenerator } from "random-avatar-generator";
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:process.env.REACT_APP_OPENAI_API_KEY
  ,dangerouslyAllowBrowser: true });

async function openai_generate() {
  const prompt_txt = "warrior with sword avatar"
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt_txt,
    n: 1,
    size: "1024x1024",
  });
  
  console.log("revised_prompt: ", image.data[0].revised_prompt);
  console.log("url: " , image.data[0].url);
}
//openai_generate();

const UpLoadImage = () => {
  
  const { user } = useUser();
  const { storage } = useFirebase();
  const [randomAvatar, setRandomAvatar] = useState("");
 

  useEffect(() => {
    console.log("randomAvatar changed:", randomAvatar);
  }, [randomAvatar]);


  useEffect(() => {
    if (user) {
      const userUID = user.uid;
      const avatarRef = ref(storage, `avatars/${userUID}.jpg`);
      //const avatarGenerator = new AvatarGenerator();
     
      const avatarGenerator = openai_generate();
      //console.log("avatarGenerator: ", avatarGenerator.data); 
      console.log("avatar_revised_prompt: ", avatarGenerator.data[0].revised_prompt);
      console.log("avatar_url: " , avatarGenerator.data[0].url);
      //image_url = response.data.data[0].url;

      // Check if the user already has an avatar in Firebase Storage
      getDownloadURL(avatarRef)
        .then((downloadURL) => {
          setRandomAvatar(downloadURL);
          console.log("avatar already exist");
          console.log("Avatar URL: ", downloadURL);
        })
        .catch(() => {
          // If the user doesn't have a saved avatar, generate and upload a random one
          // const randomAvatarURL = avatarGenerator.generateRandomAvatar();
          const randomAvatarURL = avatarGenerator.data[0].url;
          console.log("AvatarURL assigned");
          setRandomAvatar(randomAvatarURL);
          console.log("avatar doesnˇt exist");

          // Fetch the image and upload to Firebase Storage
          fetch(
            `/proxyAvatar${new URL(randomAvatarURL).pathname}${
              new URL(randomAvatarURL).search
            }`
          )
            .then((response) => {
              if (!response.ok) {
                // First, check if the response is successful
                throw new Error("Network response was not ok");
              }
              return response.blob();
            })
            .then((blob) => {
              console.log(blob);

              // Upload the blob to Firebase Storage
              return uploadBytes(avatarRef, blob);
            })
            .then((snapshot) => {
              return getDownloadURL(snapshot.ref);
            })
            .then((downloadURL) => {
              setRandomAvatar(downloadURL);
              console.log("New URL: ", downloadURL);
            })
            .catch((error) => {
              console.error(
                "Error uploading avatar to Firebase Storage:",
                error
              );
            });
        });
    }
  }, [user, storage]);

  return (
    <div>
      <h1>Your Profile</h1>
      {randomAvatar && <img src={randomAvatar} alt="Random Avatar" />}
    </div>
  );
};

export default UpLoadImage;