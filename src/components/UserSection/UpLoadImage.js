import React, { useEffect, useState } from "react";
import { AvatarGenerator } from "random-avatar-generator";
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpLoadImage = () => {
  const avatarGenerator = new AvatarGenerator();
  const { user } = useUser();
  const { storage } = useFirebase();
  const [randomAvatar, setRandomAvatar] = useState("");
  const [savedAvatar, setSavedAvatar] = useState("");

  useEffect(() => {
    if (user) {
      const userUID = user.uid;
      const avatarRef = ref(storage, `avatars/${userUID}.jpg`);

      // Check if the user already has an avatar in Firebase Storage
      getDownloadURL(avatarRef)
        .then((downloadURL) => {
          setSavedAvatar(downloadURL);
          console.log('avatar already exist')
          console.log('Avatar URL: ' , downloadURL);

        })
        .catch(() => {
          // If the user doesn't have a saved avatar, generate and upload a random one
          const randomAvatarURL = avatarGenerator.generateRandomAvatar();
          setRandomAvatar(randomAvatarURL);
          console.log('avatar doesnˇt exist')

          // Fetch the image and upload to Firebase Storage
          fetch(
            `/proxyAvatar${new URL(randomAvatarURL).pathname}${
              new URL(randomAvatarURL).search
            }`
          )
            .then((response) => {
              console.log("Fetch response:", response); // This line logs the fetch response
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
              console.log('New URL: ' , downloadURL);
            })
            .catch((error) => {
              console.error("Error uploading avatar to Firebase Storage:", error);
            });
        });
    }
  }, [user, storage]);

  return (
    <div>
      <h1>Your Profile</h1>
      {randomAvatar && <img src={randomAvatar} alt="Random Avatar" />}
      {savedAvatar && <img src={savedAvatar} alt="Saved Avatar" />}
    </div>
  );
};

export default UpLoadImage;