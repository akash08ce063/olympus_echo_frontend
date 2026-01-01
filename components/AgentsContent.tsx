"use client"

import { useState } from "react"
import { Bot, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"

export function AgentsContent() {
    const [assistants, setAssistants] = useState<Assistant[]>([
        {
            id: "1",
            name: "Main Support Bot",
            websocketUrl: "ws://localhost:8080",
            sampleRate: "16000",
            encoding: "pcm_16",
            createdAt: "Dec 31, 2025",
        },
        {
            id: "2",
            name: "Sales Assistant",
            websocketUrl: "ws://localhost:8081",
            sampleRate: "22050",
            encoding: "pcm_16",
            createdAt: "Dec 30, 2025",
        },
    ])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const handleAddAssistant = (assistantData: Omit<Assistant, 'id' | 'createdAt'>) => {
        const newAssistant: Assistant = {
            ...assistantData,
            id: Date.now().toString(),
            createdAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            }),
        }
        setAssistants(prev => [...prev, newAssistant])
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Agents</h1>
                    <p className="text-muted-foreground">Manage your AI assistants</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assistant
                </Button>
                <AddAssistantDialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onAddAssistant={handleAddAssistant}
                />
            </div>

            {/* Table */}
            <div className="rounded-md border border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50">
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Websocket URL</TableHead>
                            <TableHead className="font-semibold">Sample Rate</TableHead>
                            <TableHead className="font-semibold">Encoding</TableHead>
                            <TableHead className="font-semibold">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assistants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No assistants created yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assistants.map((assistant) => (
                                <TableRow key={assistant.id} className="border-border/50">
                                    <TableCell className="font-medium">{assistant.name}</TableCell>
                                    <TableCell className="font-mono text-sm">{assistant.websocketUrl}</TableCell>
                                    <TableCell>{assistant.sampleRate}</TableCell>
                                    <TableCell>{assistant.encoding}</TableCell>
                                    <TableCell className="text-muted-foreground">{assistant.createdAt}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
