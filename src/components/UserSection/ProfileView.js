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

      const avatarURL = randomAvatarURL;

      // Create a function to download the image
      function downloadImage(url) {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsArrayBuffer(blob);
            });
          });
      }

      downloadImage(avatarURL)
        .then((imageData) => {
          // Upload the image to Firebase Storage
          avatarRef.put(imageData)
            .then((snapshot) => {
              console.log('Uploaded the avatar image');
            })
            .catch((error) => {
              console.error('Error uploading the avatar image', error);
            });
        })
        .catch((error) => {
          console.error('Error downloading the avatar image', error);
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
