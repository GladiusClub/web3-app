import React, { useEffect, useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";
import { useUser } from "../contexts/UserContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import OpenAI from 'openai';
import useGenerateAvatar from "../CustomHooks/useGenerateAvatar";

const UpLoadImage = () => {
  const { user } = useUser();
  const { storage } = useFirebase();
  const [Avatar, setAvatar] = useState("");
  const { generateAvatar, isLoading, avatarData } = useGenerateAvatar();
  let avatarUrl;

  console.log("making avatar");
  generateAvatar();

  return (
    <div>
      <h1>Your Profile</h1>
      {Avatar && <img src={Avatar} alt="Random Avatar" />}
    </div>
  );
};

export default UpLoadImage;
