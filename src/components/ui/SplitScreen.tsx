// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React, { type MouseEvent, useState, useRef } from "react";
import { z } from "zod";
import { Content } from "@prisma/client";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./Button";

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
        "object-contain",
        "left-0",
        "right-0",
        "top-0",
        "bottom-0",
      ],
    },
  },
  defaultVariants: {
    base: "base",
  },
});

export interface SplitscreenProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitscreen> {
  contenttype: Content;
}
const divideSchema = z.number().min(0).max(100);
type Divide = z.infer<typeof divideSchema>;

const aspectStyleSchema = z.object({
  height: z.string(),
  width: z.string(),
});
type aspectStyle = z.infer<typeof aspectStyleSchema>;

export const Splitscreen: React.FC<SplitscreenProps> = ({
  className,
  ...props
}) => {
  const [divide, setDivide] = useState<Divide>(50);
  const onmousemove = (e: MouseEvent<HTMLElement>): void => {
    let mid: number =
      (100 * e.clientX) / ((document.body.clientWidth * maxWidth) / 100);
    mid = mid - 12.5;
    mid = mid - (mid - 50) * 0.007;
    setDivide(mid);
  };

  const maxWidth = 80;
  const maxHeight = 90;

  const [aspectStyle, setAspectStyle] = useState<aspectStyle>({
    height: `${maxHeight}vh`,
    width: `${maxWidth}vw`,
  });

  const onLoadingComplete = (
    naturalWidth: number,
    naturalHeight: number
  ): void => {
    const naturalRatio = naturalWidth / naturalHeight;
    const maxRatio =
      (maxWidth * document.body.clientWidth) /
      (maxHeight * document.body.clientHeight);
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

  const videoId = "gFcDolkdB9A";
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get(
          `https://noembed.com/embed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}`
        )
        .then((res) => res.data),
  });

  const v1 = useRef<YouTubePlayer>();
  const v2 = useRef<YouTubePlayer>();

  if (isLoading) return <div></div>;

  return (
    <div>
      <div
        className={splitscreen({ className }) + " mb-16"}
        {...props}
        style={aspectStyle}
      >
        {props.contenttype === Content.IMAGE ? (
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
            <YouTube
              className={half({ className }) + " youtubeContainer"}
              videoId="a7kTqy96Bz8"
              style={
                {
                  "--divide": `${divide}%`,
                } as React.CSSProperties
              }
              onReady={(e) => {
                v1.current = e.target;
              }}
            ></YouTube>
            <YouTube
              className={half({ className }) + " youtubeContainer clip-screen"}
              videoId="gFcDolkdB9A"
              style={
                {
                  "--divide": `${divide}%`,
                } as React.CSSProperties
              }
              onReady={(e) => {
                onLoadingComplete(data["width"], data["height"]);
                v2.current = e.target;
              }}
            ></YouTube>
            <Button
              className={
                "center absolute left-2/4 top-2/4 z-10 -translate-x-1/2 -translate-y-1/2 object-contain"
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                (v1.current as YouTubePlayer)?.playVideo();
                (v2.current as YouTubePlayer)?.playVideo();
                (e.target as HTMLButtonElement).hidden = true;
              }}
              onMouseMove={(e) => onmousemove(e)}
            >
              Play
            </Button>
          </>
        )}
        <div
          onMouseMove={onmousemove}
          className={
            half({ className }) +
            ` ${props.contenttype === Content.IMAGE ? "" : "mb-16"}`
          }
          style={{} as React.CSSProperties}
        ></div>
      </div>
    </div>
  );
};
