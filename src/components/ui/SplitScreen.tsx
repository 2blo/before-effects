// components/button.ts
import { VariantProps, cva } from "class-variance-authority";
import { MouseEvent, useState } from "react";
import { z } from "zod";

// ⚠️ Disclaimer: Use of Tailwind CSS is optional

const divideSchema = z.number().min(0).max(100);
type Divide = z.infer<typeof divideSchema>;

const splitscreen = cva("splitscreen", {
  variants: {
    intent: {
      primary: ["text-white", "border-transparent", "hover:bg-blue-600"],
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
    fit: {
      max: ["bg-red-700", "h-48", "relative", "w-screen", "mx-10"],
    },
  },
  compoundVariants: [
    { intent: "primary", size: "medium", className: "uppercase" },
  ],
  defaultVariants: {
    intent: "primary",
    size: "medium",
    fit: "max",
  },
});

const base = <div className="bg-slate-600"></div>;

export interface SplitscreenProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitscreen> {}

export const Splitscreen: React.FC<SplitscreenProps> = ({
  className,
  intent,
  size,
  ...props
}) => {
  const [divide, setDivide] = useState<Divide>(50);
  const onmousemove = (e: MouseEvent<HTMLDivElement>) => {
    setDivide(
      ((e.clientX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth) *
        100
    );
  };

  return (
    <div
      onMouseMove={onmousemove}
      className={splitscreen({ intent, size, className })}
      {...props}
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-red-300"></div>

      <div
        style={{ "--divide": `${divide}%` } as React.CSSProperties}
        className="clip-screen absolute left-0 right-0 top-0 bottom-0 bg-blue-500"
      ></div>
    </div>
  );
};
