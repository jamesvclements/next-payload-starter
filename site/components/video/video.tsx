'use client';

import MuxVideo from '@mux/mux-video-react';
import cn from 'classnames';
import { HTMLProps, useEffect, useRef, useState } from 'react';
import './video.css';
import { useHover } from '@/lib/hooks/use-hover';

interface VideoProps extends HTMLProps<HTMLVideoElement> {
    video: {
        muxPlaybackId: string;
        thumbnailTime?: number;
    };
    play?: boolean;
    playWhileHover?: boolean;
    showControls?: boolean;
    // className?: string;
    // style?: HTMLProps<HTMLVideoElement>["style"];
}

export default function Video({
    video,
    autoPlay,
    play,
    playWhileHover,
    onPlay,
    className = '',
    style = {},
    ...rest
}: VideoProps & {
    onPlay?: () => void;
}) {
    const { muxPlaybackId, thumbnailTime } = video;

    let aspectRatio: string = '';

    // const ref = useRef<HTMLVideoElement>(null);

    const [ref, isHovered] = useHover<HTMLVideoElement>();

    const [useFallback, setUseFallback] = useState(false);

    const playVideo = async () => {
        try {
            await ref.current!.play();
            if (onPlay) {
                onPlay();
            }
            setUseFallback(false);
        } catch (err) {
            console.error(err);
            setUseFallback(true);
        }
    };

    useEffect(() => {
        if (play !== undefined && ref.current) {
            if (play) {
                playVideo();
            } else {
                ref.current.pause();
                ref.current.currentTime = thumbnailTime || 0;
            }
        }
        /* manually autoplay, relying on natural autoplay isn't reliable */
        if (autoPlay && ref.current) {
            playVideo();
        }
    }, [play, autoPlay]);

    useEffect(() => {
        if (playWhileHover && isHovered) {
            playVideo();
        } else if (playWhileHover && !isHovered) {
            /* set back to 0 */
            ref.current!.currentTime = 1;
            ref.current!.pause();
        }
    }, [playWhileHover, isHovered]);

    const videoProps: HTMLProps<HTMLVideoElement> = {
        muted: true,
        loop: true,
        playsInline: true,
        className: cn(
            'video',
            {
                'video--is-with-controls': rest.controls,
            },
            className
        ),
        style: {
            aspectRatio,
            ...style,
        },
        onPlay,
        ...rest,
    };

    return (
        <MuxVideo
            // @ts-ignore, mux is using outdated ref
            ref={ref}
            playbackId={muxPlaybackId}
            // poster={`https://image.mux.com/${muxPlaybackId}/thumbnail.webp${
            //   thumbnailTime !== undefined && thumbnailTime !== null
            //     ? `?time=${thumbnailTime}`
            //     : ""
            // }`}
            {...videoProps}
            key={muxPlaybackId}
        ></MuxVideo>
    );

    // return (
    //   <div style={{ position: "relative" }}>
    //     <MuxVideo
    //       /* @ts-ignore */
    //       ref={ref}
    //       playbackId={muxPlaybackId}
    //       poster={`https://image.mux.com/${muxPlaybackId}/thumbnail.webp${
    //         thumbnailTime !== undefined && thumbnailTime !== null
    //           ? `?time=${thumbnailTime}`
    //           : ""
    //       }`}
    //       {...videoProps}
    //     ></MuxVideo>
    //     {useFallback && (
    //       <motion.div
    //         className="video_play-button"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           playVideo();
    //         }}
    //         whileTap="tapped"
    //       >
    //         <motion.div
    //           className="video_play-button-icon-wrapper"
    //           variants={{
    //             tapped: {
    //               scale: 0.95,
    //             },
    //           }}
    //         >
    //           <Play className="video_play-button-icon" />
    //         </motion.div>
    //       </motion.div>
    //     )}
    //   </div>
    // );
}
