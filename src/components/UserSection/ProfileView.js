
// ProfileView.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { AvatarGenerator } from 'random-avatar-generator';
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { doc, setDoc } from "firebase/firestore";


//const userDocRef = doc(db, "users", user.uid);

const ProfileView = () => {
  
  const avatarGenerator = new AvatarGenerator();
  
  const { user } = useUser();
  const { db, storage } = useFirebase();

  //const storageRef = storage.ref;

  useEffect(() => {
  if (user) {
    
    const randomAvatar = avatarGenerator.generateRandomAvatar();
    console.log(user.uid)
    const userUID = user.uid

    
    const avatarRef = storage.ref(`avatars/${userUID}.jpg`); // Unique path for each user

    const avatarURL = randomAvatar;
    
    // Upload the avatar image to Firebase Storage
    avatarRef.putString(avatarURL, 'avatar_url').then(function(snapshot) {
      //setDoc(userDocRef, )
      console.log('Uploaded the avatar image');
    }).catch(function(error) {
      console.error('Error uploading the avatar image', error);
    });
    


  }

  }, [user]);


  

  
  
  

  
  
 
  return (
    <div>
      <h1>Your Profile</h1>
     {/* <img src={randomAvatar} alt="Random Avatar" /> */}
    </div>
  );
};

export default ProfileView