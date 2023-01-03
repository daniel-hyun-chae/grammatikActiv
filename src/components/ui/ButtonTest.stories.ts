import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "@ui/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    label: "Button",
    fullWidth: false,
    intent: "primary",
    size: "sm",
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
    fullWidth: false,
    intent: "secondary",
    size: "sm",
  },
};
