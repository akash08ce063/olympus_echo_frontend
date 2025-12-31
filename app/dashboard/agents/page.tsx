"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const agents = [
    { id: 1, name: "Customer Service Bot", status: "Active", type: "Sales" },
    { id: 2, name: "Tech Support Assistant", status: "Inactive", type: "Support" },
    { id: 3, name: "Appointment Setter", status: "Active", type: "Sales" },
    { id: 4, name: "Feedback Collector", status: "Active", type: "Research" },
]

export default function AgentsPage() {
    const [selectedAgent, setSelectedAgent] = useState(agents[0])

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Voice Agents</h1>
                <Button>
                    <Plus className="mr-2 size-4" /> New Agent
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Left Panel: Agent Grid */}
                <div className="md:col-span-2 overflow-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <Card
                                key={agent.id}
                                className={`cursor-pointer hover:border-primary transition-colors ${selectedAgent.id === agent.id ? "border-primary bg-primary/5" : ""}`}
                                onClick={() => setSelectedAgent(agent)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{agent.name}</CardTitle>
                                        <Badge variant={agent.status === "Active" ? "default" : "secondary"} className={agent.status === "Active" ? "bg-green-600 hover:bg-green-700" : ""}>{agent.status}</Badge>
                                    </div>
                                    <CardDescription>{agent.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground">
                                        ID: agent-{agent.id}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Configuration */}
                <div className="md:col-span-1">
                    <Card className="h-full border-l shadow-none border-t-0 border-r-0 border-b-0 rounded-none md:border md:rounded-xl">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>Settings for {selectedAgent.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="agent-name">Name</Label>
                                <Input id="agent-name" defaultValue={selectedAgent.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ws-url">WebSocket URL</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                        wss://
                                    </span>
                                    <Input id="ws-url" placeholder="api.agent.ai/v1/stream" className="rounded-l-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Encoding</Label>
                                    <Select defaultValue="mulaw">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select encoding" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mulaw">PCR Mulaw</SelectItem>
                                            <SelectItem value="pcm">Linear PCM</SelectItem>
                                            <SelectItem value="opus">Opus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sample Rate</Label>
                                    <Select defaultValue="8000">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="8000">8000 Hz</SelectItem>
                                            <SelectItem value="16000">16000 Hz</SelectItem>
                                            <SelectItem value="24000">24000 Hz</SelectItem>
                                            <SelectItem value="48000">48000 Hz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Authentication</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="api-key">API Key</Label>
                                    <Input id="api-key" type="password" value="sk-........................" readOnly />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button className="w-full">Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
