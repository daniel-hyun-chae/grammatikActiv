import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Button as ReakitButton } from "reakit/Button";

import type { ButtonProps as ReakitButtonProps } from "reakit/Button";

const buttonStyles = cva(
  "flex items-center justify-center rounded-full font-medium disabled:bg-neutral-100 disabled:text-neutral-800",
  {
    variants: {
      intent: {
        primary: "bg-cyan-600 text-white",
        secondary: "bg-neutral-300 text-black",
      },
      size: {
        sm: "px-2 py-0.5 text-sm",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "sm",
      fullWidth: false,
    },
  }
);

type ButtonProps = VariantProps<typeof buttonStyles> &
  ReakitButtonProps & {
    label: string;
  };

export function Button({ intent, fullWidth, label, ...props }: ButtonProps) {
  return (
    <ReakitButton className={buttonStyles({ intent, fullWidth })} {...props}>
      {label}
    </ReakitButton>
  );
}
