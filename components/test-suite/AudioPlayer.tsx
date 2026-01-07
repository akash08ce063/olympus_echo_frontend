"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
    url: string
    className?: string
}

export function AudioPlayer({ url, className }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const onLoadedMetadata = () => {
            setDuration(audio.duration)
            setIsLoading(false)
        }

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const onEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }

        audio.addEventListener("loadedmetadata", onLoadedMetadata)
        audio.addEventListener("timeupdate", onTimeUpdate)
        audio.addEventListener("ended", onEnded)

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata)
            audio.removeEventListener("timeupdate", onTimeUpdate)
            audio.removeEventListener("ended", onEnded)
        }
    }, [])

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const onSliderChange = (value: number[]) => {
        if (!audioRef.current) return
        const time = value[0]
        audioRef.current.currentTime = time
        setCurrentTime(time)
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div className={cn("flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-border/50", className)}>
            <audio ref={audioRef} src={url} preload="metadata" />

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={togglePlay}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
            </Button>

            <div className="flex-1 flex flex-col gap-1">
                <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={onSliderChange}
                    className="cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 px-1">
                <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
        </div>
    )
}
