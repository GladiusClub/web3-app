import React, { useEffect, useState } from "react";
import { AvatarGenerator } from 'random-avatar-generator';
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const ProfileView = () => {
  const avatarGenerator = new AvatarGenerator();
  const { user } = useUser();
  const { storage } = useFirebase();

  const [randomAvatar, setRandomAvatar] = useState(""); // Define randomAvatar in the outer scope

  useEffect(() => {
    if (user) {
      const userUID = user.uid;
      const avatarRef = ref(storage, `avatars/${userUID}.jpg`);

      // Generate a random avatar URL
      const randomAvatarURL = avatarGenerator.generateRandomAvatar();
      console.log('UID: ', user.uid);
      console.log('randomAvatarURL: ' , randomAvatarURL);

      // Convert the data URL to base64
      const dataURL = randomAvatarURL.split(',')[1]; // Remove the 'data:image/jpeg;base64,' prefix
      const base64Data = atob(dataURL);

      // Upload the avatar image to Firebase Storage
      uploadString(avatarRef, base64Data, 'base64', { contentType: 'image/jpeg' })
        .then(() => {
          console.log('Uploaded the avatar image');

          // Now, get the download URL for the uploaded avatar
          getDownloadURL(avatarRef)
            .then((downloadURL) => {
              setRandomAvatar(downloadURL);
            })
            .catch((error) => {
              console.error('Error getting download URL', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading the avatar image', error);
        });
    }
  }, [user, storage]);

  return (
    <div>
      <h1>Your Profile</h1>
      {randomAvatar && (
        <img src={randomAvatar} alt="Random Avatar" />
      )}
    </div>
  );
};

export default ProfileView;
