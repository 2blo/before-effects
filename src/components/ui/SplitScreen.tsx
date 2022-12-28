// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React, { type MouseEvent, useState, useRef } from "react";
import { z } from "zod";
import { Content, Post } from "@prisma/client";
import YouTube, { YouTubePlayer } from "react-youtube";
import { Button } from "./Button";
import { atom, useAtom } from "jotai";

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
  before: Post["before"];
  after: Post["after"];
}

const divideSchema = z.number().min(0).max(100);
type Divide = z.infer<typeof divideSchema>;

const aspectStyleSchema = z.object({
  height: z.string(),
  width: z.string(),
});
type AspectStyle = z.infer<typeof aspectStyleSchema>;

export const aspectAtom = atom<AspectStyle>({ height: "none", width: "none" });

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

  const [aspectStyle, setAspectStyle] = useState<AspectStyle>({
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

  const afterPlayer = useRef<YouTubePlayer>();
  const beforePlayer = useRef<YouTubePlayer>();
  const beforeAudioActive = useRef<boolean>(true);

  const [, setAspect] = useAtom(aspectAtom);

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
              src={props.after}
              alt="image loading"
              fill
              onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                onLoadingComplete(naturalWidth, naturalHeight);
              }}
            ></Image>
            <Image
              className={half({ className }) + " clip-screen"}
              src={props.before}
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
              videoId={props.after}
              style={
                {
                  "--divide": `${divide}%`,
                } as React.CSSProperties
              }
              onReady={(e) => {
                afterPlayer.current = e.target;
                if (beforeAudioActive.current) {
                  e.target.mute();
                } else e.target.unMute();
              }}
            ></YouTube>
            <YouTube
              className={half({ className }) + " youtubeContainer clip-screen"}
              videoId={props.before}
              style={
                {
                  "--divide": `${divide}%`,
                } as React.CSSProperties
              }
              onReady={(e) => {
                onLoadingComplete(16, 9);
                setAspect(aspectStyle);
                beforePlayer.current = e.target;
                if (beforeAudioActive.current) {
                  e.target.unMute();
                } else e.target.mute();
              }}
            ></YouTube>
            <Button
              className={
                "center absolute left-2/4 top-2/4 z-10 -translate-x-1/2 -translate-y-1/2 object-contain"
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                (afterPlayer.current as YouTubePlayer)?.playVideo();
                (beforePlayer.current as YouTubePlayer)?.playVideo();
                (e.target as HTMLButtonElement).hidden = true;
              }}
              onMouseMove={(e) => onmousemove(e)}
            >
              Play
            </Button>
            <Button
              className={
                "center absolute left-2/4 bottom-0 z-10 -translate-x-1/2 object-contain"
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                beforeAudioActive.current = !beforeAudioActive.current;
                if (beforeAudioActive.current) {
                  beforePlayer.current.unMute();
                  afterPlayer.current.mute();
                } else {
                  beforePlayer.current.mute();
                  afterPlayer.current.unMute();
                }
              }}
            >
              Switch Audio Track
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
