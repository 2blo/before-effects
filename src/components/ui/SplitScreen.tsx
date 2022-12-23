// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import { type MouseEvent, useState } from "react";
import { z } from "zod";
import { Content } from "@prisma/client";

const divideSchema = z.number().min(0).max(100);
type Divide = z.infer<typeof divideSchema>;

const splitscreen = cva("splitscreen", {
  variants: {
    base: {
      base: ["relative"],
    },
  },
  defaultVariants: {
    base: "base",
  },
});

const half = cva("half", {
  variants: {
    base: {
      base: [
        "absolute",
        "left-0",
        "right-0",
        "top-0",
        "bottom-0",
        "object-contain",
      ],
    },
  },
  defaultVariants: {
    base: "base",
  },
});

export interface SplitscreenProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitscreen> {}

export const Splitscreen: React.FC<SplitscreenProps> = ({
  className,
  ...props
}) => {
  const [divide, setDivide] = useState<Divide>(50);
  const onmousemove = (e: MouseEvent<HTMLDivElement>) => {
    setDivide(
      ((e.clientX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth) *
        100
    );
  };

  const maxWidth = 70;
  const maxHeight = 80;
  const [aspectStyle, setAspectStyle] = useState({
    height: `${0}vh`,
    width: `${0}vw`,
  });
  const onLoadingComplete = (naturalWidth: number, naturalHeight: number) => {
    const naturalRatio = naturalWidth / naturalHeight;
    const maxRatio = (maxWidth * screen.width) / (maxHeight * screen.height);
    if (naturalRatio > maxRatio) {
      setAspectStyle({
        height: `${maxWidth / naturalRatio}vw`,
        width: `${maxWidth}vw`,
      });
    } else {
      setAspectStyle({
        height: `${maxHeight}vh`,
        width: `${maxHeight * naturalRatio}vh`,
      });
    }
  };

  const content: Content = "IMAGE";
  return (
    <div
      onMouseMove={onmousemove}
      className={splitscreen({ className })}
      {...props}
      style={aspectStyle}
    >
      {content === Content.IMAGE ? (
        <>
          <Image
            className={half({ className })}
            src="https://preview.redd.it/fcwt76c4kp7a1.png?width=8000&format=png&auto=webp&s=fa00ec8bcb0979c26c078f6f9764c7a35a9db33a"
            alt="image loading"
            fill
            onLoadingComplete={({ naturalWidth, naturalHeight }) =>
              onLoadingComplete(naturalWidth, naturalHeight)
            }
          ></Image>
          <Image
            className={half({ className }) + " clip-screen"}
            src="https://preview.redd.it/h93al5c4kp7a1.png?width=8000&format=png&auto=webp&s=c35051f26e05d7a9d5a7cdf760f6cd1cb005035e"
            alt="image loading"
            fill
            style={
              {
                "--divide": `${divide}%`,
              } as React.CSSProperties
            }
          ></Image>
        </>
      ) : (
        <>
          <Image
            className={half({ className })}
            src="https://preview.redd.it/h93al5c4kp7a1.png?width=8000&format=png&auto=webp&s=c35051f26e05d7a9d5a7cdf760f6cd1cb005035e"
            alt="image loading"
            fill
            onLoadingComplete={({ naturalWidth, naturalHeight }) =>
              onLoadingComplete(naturalWidth, naturalHeight)
            }
          ></Image>
          <Image
            className={half({ className }) + " clip-screen"}
            src="https://preview.redd.it/fcwt76c4kp7a1.png?width=8000&format=png&auto=webp&s=fa00ec8bcb0979c26c078f6f9764c7a35a9db33a"
            alt="image loading"
            fill
            style={
              {
                "--divide": `${divide}%`,
              } as React.CSSProperties
            }
          ></Image>
        </>
      )}
    </div>
  );
};
