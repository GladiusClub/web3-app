import React, { useState } from "react";
import { ClubSignUpForm } from "./SignUpForm";
import ClubStep2 from "./ClubLoginStep2";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useFirebase } from "../contexts/firebaseContext";

function SignUp() {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ clubName: "" }); // Initialize with default empty string for clubName
  const { auth } = useFirebase();

  const handleSignUp = (details) => {
    setDetails(details);
    createUserWithEmailAndPassword(auth, details.email, details.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Set the name as the username
        return updateProfile(user, { displayName: details.userName }).then(
          () => {
            // Profile updated
            setStep(step + 1);
          }
        );
      })
      .catch((error) => {
        // An error occurred during the sign-up
        console.error("Error signing up: ", error);
      });
  };

  // Steps array is now created inside the render to ensure it uses the latest state
  const clubSteps = [
    <ClubSignUpForm onSubmit={handleSignUp} />,
    details.clubName ? (
      <ClubStep2
        clubName={details.clubName}
        calendar={details.googleCalendar}
      />
    ) : null, // Ensure ClubStep2 is only rendered if clubName exists
  ];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {clubSteps[step]}
    </div>
  );
}

export default SignUp;
