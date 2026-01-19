"use client"

import { MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TranscriptViewProps {
    transcript: any
    selectedRunDetailId?: string
    onFetchTranscript?: () => void
    isFetching?: boolean
}

export function TranscriptView({
    transcript,
    selectedRunDetailId,
}: TranscriptViewProps) {
    // Handle both direct structure (from getAllRuns) and potentially nested if legacy exists
    // Primary target: transcript.call_transcript (array of messages)
    const transcriptMessages = transcript?.call_transcript || transcript?.transcript?.call_transcript;
    const hasTranscript = transcriptMessages && transcriptMessages.length > 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold">Conversation Transcript</h4>
            </div>
            <Card className="bg-card border-border/50 overflow-hidden">
                <CardContent className="p-0">
                    {hasTranscript ? (
                        <ScrollArea className="h-[calc(100vh-20rem)]">
                            <div className="flex flex-col gap-4 p-4">
                                {transcriptMessages.map((msg: any, msgIdx: number) => {
                                    // role: "user" = TARGET (right side, orange)
                                    // role: "assistant" = TESTER (left side, gray/primary)
                                    const isTarget = msg.role === 'user';

                                    return (
                                        <div
                                            key={msgIdx}
                                            className={cn(
                                                "flex flex-col gap-2 max-w-[85%] lg:max-w-[75%] group animate-in fade-in slide-in-from-bottom-3 duration-500",
                                                isTarget ? "self-end items-end" : "self-start"
                                            )}
                                            style={{ animationDelay: `${msgIdx * 50}ms` }}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-2 px-1",
                                                isTarget ? "justify-end" : "justify-start"
                                            )}>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-widest",
                                                    isTarget ? "text-orange-600 dark:text-orange-400" : "text-primary"
                                                )}>
                                                    {isTarget ? 'TARGET' : 'TESTER'}
                                                </span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all group-hover:shadow-md",
                                                    isTarget
                                                        ? "bg-orange-500 text-white rounded-tr-none shadow-orange-500/20"
                                                        : "bg-muted text-muted-foreground rounded-tl-none border border-border/30 shadow-sm"
                                                )}
                                            >
                                                {msg.content || msg.text || msg.message}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">No transcript available for this call</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

