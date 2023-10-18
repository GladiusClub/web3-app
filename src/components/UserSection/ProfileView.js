// ProfileView.js
import React from "react";
import { AvatarGenerator } from 'random-avatar-generator';

const ProfileView = () => {
  const avatarGenerator = new AvatarGenerator();
  const randomAvatar = avatarGenerator.generateRandomAvatar();

  return (
    <div>
      <h1>Your Profile</h1>
      <img src={randomAvatar} alt="Random Avatar" />
    </div>
  );
};

export default ProfileView;
