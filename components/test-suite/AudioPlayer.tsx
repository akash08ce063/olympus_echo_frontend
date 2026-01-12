"use client"

import * as React from "react"
import { Play, Pause, Volume2, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
    url: string
    className?: string
}

export function AudioPlayer({ url, className }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const audioRef = React.useRef<HTMLAudioElement>(null)

    const togglePlay = () => {
        if (audioRef.current && !error) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleCanPlay = () => {
        setIsLoading(false)
        setError(null)
    }

    const handleError = () => {
        setIsLoading(false)
        setError("Failed to load audio")
        console.error("Audio playback error for URL:", url)
    }

    const handleSliderChange = (value: number[]) => {
        if (audioRef.current && !error) {
            audioRef.current.currentTime = value[0]
            setCurrentTime(value[0])
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div className={cn("flex flex-col gap-1 bg-muted rounded-lg p-3 border min-w-[200px]", className)}>
            <div className="flex items-center gap-3">
                <audio
                    ref={audioRef}
                    src={url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlay={handleCanPlay}
                    onError={handleError}
                    onEnded={() => setIsPlaying(false)}
                    preload="metadata"
                />

                <Button
                    size="icon"
                    className={cn(
                        "h-8 w-8 rounded-full shrink-0 transition-all duration-300 border-none shadow-sm",
                        error
                            ? "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                            : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                    }}
                    disabled={isLoading || !!error}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : error ? (
                        <XCircle className="h-4 w-4" />
                    ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4 fill-current" />
                    )}
                </Button>

                <div className="flex-1">
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSliderChange}
                        className={cn("cursor-pointer", !!error && "opacity-50 pointer-events-none")}
                        disabled={!!error}
                    />
                </div>

                <Volume2 className={cn("h-4 w-4 shrink-0 transition-opacity", error ? "opacity-20" : "text-muted-foreground")} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-11">
                {error ? (
                    <span className="text-destructive font-bold uppercase tracking-tighter">Playback Error</span>
                ) : (
                    <>
                        <span>{formatTime(currentTime)}</span>
                        <span>{duration ? formatTime(duration) : "0:00"}</span>
                    </>
                )}
            </div>
        </div>
    )
}
