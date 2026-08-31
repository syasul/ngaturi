import { Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
    musicUrl?: string;
    autoPlay: boolean;
    isPlaying?: boolean;
    onTogglePlay?: (playing: boolean) => void;
    showButton?: boolean;
}

const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
    musicUrl,
    autoPlay,
    isPlaying: isPlayingProp,
    onTogglePlay,
    showButton = true,
}) => {
    const [localIsPlaying, setLocalIsPlaying] = useState(false);
    const isPlaying = isPlayingProp !== undefined ? isPlayingProp : localIsPlaying;
    const setIsPlaying = onTogglePlay !== undefined ? onTogglePlay : setLocalIsPlaying;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const youtubeId = musicUrl ? getYouTubeId(musicUrl) : null;

    useEffect(() => {
        if (musicUrl && !youtubeId && !audioRef.current) {
            audioRef.current = new Audio(musicUrl);
            audioRef.current.loop = true;
        } else if (audioRef.current && musicUrl && !youtubeId) {
            audioRef.current.src = musicUrl;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [musicUrl, youtubeId]);

    // Handle autoplay trigger
    useEffect(() => {
        if (autoPlay) {
            if (youtubeId) {
                setIsPlaying(true);
            } else if (audioRef.current) {
                audioRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((err) =>
                        console.warn(
                            'Autoplay prevented by browser security:',
                            err,
                        ),
                    );
            }
        }
    }, [autoPlay, youtubeId]);

    // React to changes in the isPlaying state/prop
    useEffect(() => {
        if (youtubeId) {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                const command = isPlaying ? 'playVideo' : 'pauseVideo';
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: command, args: '' }),
                    '*'
                );
            }
        } else if (audioRef.current) {
            if (isPlaying) {
                if (audioRef.current.paused) {
                    audioRef.current.play().catch((err) =>
                        console.warn('Playback error:', err)
                    );
                }
            } else {
                if (!audioRef.current.paused) {
                    audioRef.current.pause();
                }
            }
        }
    }, [isPlaying, youtubeId]);

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    if (!musicUrl) return null;
    if (!showButton) return null;

    return (
        <>
            {youtubeId && (
                <iframe
                    ref={iframeRef}
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                    src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=0`}
                    allow="autoplay"
                    title="YouTube Background Music"
                />
            )}
            <button
                type="button"
                onClick={togglePlayback}
                className={`fixed bottom-16 left-6 z-30 flex cursor-pointer items-center justify-center rounded-full border border-sand/35 p-3 shadow-2xl transition-all duration-300 ${
                    isPlaying
                        ? 'animate-spin-slow bg-amber-500 text-white shadow-amber-500/20'
                        : 'bg-white text-charcoal'
                }`}
                title={isPlaying ? 'Mute Music' : 'Play Music'}
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
        </>
    );
};

export default MusicPlayer;
