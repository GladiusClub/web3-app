import { Component } from ".";

export default {
  title: "Components/Component",
  component: Component,
  argTypes: {
    kind: {
      options: ["avatar-3", "avatar-1", "avatar-6", "avatar-4", "avatar-2", "avatar-5"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    kind: "avatar-3",
    className: {},
  },
};
