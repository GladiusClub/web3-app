import { Bar } from ".";

export default {
  title: "Components/Bar",
  component: Bar,
  argTypes: {
    mode: {
      options: ["light-content", "dark-content"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    mode: "light-content",
    className: {},
  },
};
