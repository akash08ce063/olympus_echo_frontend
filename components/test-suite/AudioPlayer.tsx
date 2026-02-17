"use client"

import * as React from "react"
import { Play, Pause, Download, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
    url: string
    className?: string
}

/** Strip surrounding quotes/backslashes that can come from JSON or DB (e.g. "\"https://...\""). */
function normalizeAudioUrl(raw: string): string {
    if (!raw || typeof raw !== "string") return ""
    let s = raw.trim()
    // Remove escaped quotes around the URL (e.g. "\"https://...\"")
    s = s.replace(/^\\"/, "").replace(/\\"$/, "")
    // Remove any remaining surrounding quotes
    while ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1).trim()
    }
    return s.trim()
}

export function AudioPlayer({ url, className }: AudioPlayerProps) {
    const normalizedUrl = React.useMemo(() => normalizeAudioUrl(url), [url])
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(!!normalizedUrl)
    const [error, setError] = React.useState<string | null>(normalizedUrl ? null : "No recording available")
    const audioRef = React.useRef<HTMLAudioElement>(null)

    React.useEffect(() => {
        if (!normalizedUrl) {
            setIsLoading(false)
            setError("No recording available")
        } else {
            setIsLoading(true)
            setError(null)
        }
    }, [normalizedUrl])

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
        console.error("Audio playback error for URL:", normalizedUrl)
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

    const handleDownload = () => {
        try {
            const urlWithoutQuery = normalizedUrl.split("?")[0]
            const filename = urlWithoutQuery.split("/").pop() || "audio.wav"

            const link = document.createElement("a")
            link.href = normalizedUrl
            link.download = filename
            link.target = "_blank"
            link.rel = "noopener noreferrer"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error("Failed to download audio:", err)
        }
    }

    return (
        <div className={cn("flex flex-col gap-1 bg-muted rounded-lg p-3 border min-w-[200px]", className)}>
            <div className="flex items-center gap-3">
                {/* Only set src when we actually have a URL to avoid browser re-requesting the page for src="" */}
                <audio
                    ref={audioRef}
                    src={normalizedUrl || undefined}
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

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                    }}
                    disabled={!!error}
                    title="Download audio"
                >
                    <Download className={cn("h-4 w-4 transition-opacity", error ? "opacity-20" : "text-muted-foreground")} />
                </Button>
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
