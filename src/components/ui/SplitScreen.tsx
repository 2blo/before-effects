// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React, { type MouseEvent, useState, useRef } from "react";
import { z } from "zod";
import { Content, type Post } from "@prisma/client";
import YouTube, { type YouTubePlayer, type YouTubeEvent } from "react-youtube";
import { Button } from "./Button";
import { atom, useAtom } from "jotai";

const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

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

  const beforePlayer = useRef<YouTubePlayer>();
  const afterPlayer = useRef<YouTubePlayer>();
  const beforeAudioActive = useRef<boolean>(true);

  const [, setAspect] = useAtom(aspectAtom);

  // --------------------------------------------------------------------------
  const preloadingBefore = useRef<boolean>(false);
  const preloadingAfter = useRef<boolean>(false);
  const readyBefore = useRef<boolean>(false);
  const readyAfter = useRef<boolean>(false);
  const doneAfter = useRef<boolean>(false);
  const loadPauseBefore = useRef<boolean>(true);

  const onBeforePlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === PLAYING) {
      if (preloadingBefore.current) {
        beforePlayer.current.pauseVideo();
        beforePlayer.current.seekTo(0);
        preloadingBefore.current = false;
        readyAfter.current = true;
        preloadingAfter.current = true;
        afterPlayer.current.seekTo(1.1);
      } else afterPlayer.current.playVideo();
    } else if (event.data === PAUSED) {
      if (!preloadingBefore.current) afterPlayer.current.pauseVideo();
    } else if (event.data === BUFFERING) {
      if (!preloadingBefore.current) {
        afterPlayer.current.pauseVideo();
      }
    } else if (event.data === CUED) {
      if (!preloadingBefore.current) afterPlayer.current.pauseVideo();
    } else if (event.data === ENDED) {
      afterPlayer.current.stopVideo();
    }
  };

  const onAfterPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === PLAYING) {
      if (preloadingAfter.current) {
        afterPlayer.current.pauseVideo();
        afterPlayer.current.seekTo(0);
        preloadingAfter.current = false;
        // afterPlayer.current.playVideo(); // "improves sync but double click needed"
      } else {
        beforePlayer.current.playVideo();
      }
    } else if (event.data === PAUSED) {
      if (!preloadingAfter.current) {
        beforePlayer.current.pauseVideo();
        if (loadPauseBefore.current) {
          beforePlayer.current.playVideo();
          loadPauseBefore.current = false;
        }
      }
    } else if (event.data === BUFFERING) {
      if (!preloadingAfter.current) {
        beforePlayer.current.pauseVideo();
      } else {
        doneAfter.current = true;
      }
    } else if (event.data === CUED) {
      if (!preloadingAfter.current) beforePlayer.current.pauseVideo();
    } else if (event.data === ENDED) {
      beforePlayer.current.stopVideo();
    } else if (event.data === UNSTARTED) {
      if (doneAfter.current) {
        doneAfter.current = false;
        afterPlayer.current.playVideo();
      }
    }
  };
  // --------------------------------------------------------------------------
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
              style={{} as React.CSSProperties}
              opts={{
                playerVars: {
                  showinfo: 1,
                  modestbranding: true,
                  controls: 1,
                  loop: 1,
                  mute: 1,
                },
              }}
              onReady={(e) => {
                afterPlayer.current = e.target;
              }}
              onStateChange={onAfterPlayerStateChange}
            ></YouTube>
            <YouTube
              className={half({ className }) + " youtubeContainer clip-screen"}
              videoId={props.before}
              style={
                {
                  "--divide": `${divide}%`,
                } as React.CSSProperties
              }
              opts={{
                playerVars: {
                  showinfo: 1,
                  modestbranding: true,
                  controls: 1,
                  loop: 1,
                  mute: 0,
                },
              }}
              onReady={(e) => {
                onLoadingComplete(16, 9);
                setAspect(aspectStyle);
                beforePlayer.current = e.target;
              }}
              onStateChange={onBeforePlayerStateChange}
            ></YouTube>
            <Button
              className={
                "center absolute left-2/4 top-2/4 z-10 -translate-x-1/2 -translate-y-1/2 object-contain py-6 px-12 text-3xl"
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.hidden = true;
                readyBefore.current = true;
                preloadingBefore.current = true;
                beforePlayer.current.seekTo(1);
                readyAfter.current = true;
              }}
              onMouseMove={(e) => onmousemove(e)}
            >
              Play
            </Button>
            <Button
              className={
                "center absolute left-2/4 bottom-0 z-10 -translate-x-1/2 object-contain"
              }
              onClick={() => {
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
