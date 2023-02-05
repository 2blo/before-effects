// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";

// ⚠️ Disclaimer: Use of Tailwind CSS is optional
const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "bg-blue-500",
        "text-white",
        "border-transparent",
        "hover:bg-blue-600",
      ],
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
      inList: ["group flex w-full items-center rounded-md px-2 py-2 text-sm"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
    hover: {
      true: ["bg-white text-neutral-800"],
      false: ["text-white"],
    },
  },
  compoundVariants: [
    { intent: "primary", size: "medium", className: "uppercase" },
  ],
  defaultVariants: {
    intent: "primary",
  },
});

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  hover,
  size,
  ...props
}) => (
  <button className={button({ intent, hover, size, className })} {...props} />
);
