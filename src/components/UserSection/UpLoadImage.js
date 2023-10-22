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

  useEffect(() => {
    if (user) {
      const userUID = user.uid;
      const avatarRef = ref(storage, `avatars/${userUID}.jpg`);

      const randomAvatarURL = avatarGenerator.generateRandomAvatar();
      console.log("UID: ", user.uid);
      console.log("randomAvatarURL: ", randomAvatarURL);

      // Fetch the image and upload to Firebase Storage
      fetch(`https://cors-anywhere.herokuapp.com/${randomAvatarURL}`)
        .then((response) => response.blob())
        .then((blob) => {
          // Upload the blob to Firebase Storage
          return uploadBytes(avatarRef, blob);
        })
        .then((snapshot) => {
          // Get the download URL if you want to display it later
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Uploaded to Firebase Storage with URL:", downloadURL);
          setRandomAvatar(downloadURL);
        })
        .catch((error) => {
          console.error("Error uploading avatar to Firebase Storage:", error);
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
