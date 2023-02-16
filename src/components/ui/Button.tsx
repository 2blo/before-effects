// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import {
  type HTMLMotionProps,
  motion,
  useAnimationControls,
  type AnimationControls,
} from "framer-motion";
import { type MouseEvent } from "react";

const base = "border-transparent py-2 px-6 rounded-full shadow-2xl";

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        base,
        "bg-gradient-to-r from-red-900/80 to-rose-900 text-white  hocus:from-black/10 border-opacity-0 hocus:border-red-900/60 border-[1px]",
      ],
      secondary: [
        base,
        "bg-gradient-to-r from-black/50 to-neutral-900/50 border-black/30  hocus:from-neutral-600/40",
      ],
      opaque: [
        base,
        "bg-gradient-to-r from-red-700 to-rose-600 text-white hocus:from-red-600 hocus:to-rose-500",
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
  extends HTMLMotionProps<"button">,
    VariantProps<typeof button> {
  clickAnimation?: Parameters<AnimationControls["start"]>[0][];
  onChildClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  hover,
  size,
  clickAnimation,
  onChildClick,
  ...props
}) => {
  const animationControls = useAnimationControls();
  return (
    <motion.button
      className={button({ intent, hover, size, className })}
      onClick={async (e) => {
        if (onChildClick) {
          onChildClick(e);
        }
        for (const keyFrame of clickAnimation ? clickAnimation : []) {
          await animationControls.start(keyFrame);
        }
      }}
      {...props}
      animate={animationControls}
    />
  );
};
