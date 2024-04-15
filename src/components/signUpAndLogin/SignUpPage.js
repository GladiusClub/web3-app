import React, { useState } from "react";
import { ClubSignUpForm } from "./SignUpForm";
import ClubStep2 from "./ClubLoginStep2";

function SignUp() {
  const [step, setStep] = useState(0); // Start from 0 but it now corresponds to the old step 1

  const clubSteps = [
    <ClubSignUpForm
      onSubmit={(details) => {
        setStep(step + 1);
      }}
    />,
    <ClubStep2 />,
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
