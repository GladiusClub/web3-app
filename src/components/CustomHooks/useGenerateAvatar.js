import { useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";

const useGenerateAvatar = () => {
  const { auth } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarData, setAvatarData] = useState(null);

  const generateAvatar = async (prompt) => {
    if (!prompt) {
      console.error("Please provide a valid prompt.");
      return;
    }

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      setIsLoading(true);

      const response = await fetch("/proxyAvatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const rawText = await response.text();
        console.error("Response is not JSON:", rawText);
        throw new Error("Response was not in JSON format");
      }

      const data = await response.json();
      setAvatarData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating avatar:", error);
    }
  };

  return { generateAvatar, isLoading, avatarData };
};

export default useGenerateAvatar;
