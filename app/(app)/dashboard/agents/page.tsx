"use client"

import { useState } from "react"
import { Plus, Bot, Settings, Activity } from 'lucide-react'
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
    { id: 1, name: "Customer Service Bot", status: "Active", type: "Sales", model: "GPT-4", lastActive: "2 hours ago" },
    { id: 2, name: "Tech Support Assistant", status: "Inactive", type: "Support", model: "Claude-3", lastActive: "1 day ago" },
    { id: 3, name: "Appointment Setter", status: "Active", type: "Sales", model: "GPT-4", lastActive: "30 min ago" },
    { id: 4, name: "Feedback Collector", status: "Active", type: "Research", model: "Claude-3", lastActive: "5 hours ago" },
]

export default function AgentsPage() {
    const [selectedAgent, setSelectedAgent] = useState(agents[0])

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Bot className="w-8 h-8" />
                        Target Agents
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your target AI agents for testing
                    </p>
            </div>

                {/* Create New Agent */}
                <Card className="border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                        <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Add New Target Agent</h3>
                        <p className="text-muted-foreground mb-4">
                            Connect a new AI agent to test against your test suites
                        </p>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Agent
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Agent List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold">Your Agents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {agents.map((agent) => (
                            <Card
                                key={agent.id}
                                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 ${
                                        selectedAgent.id === agent.id ? "ring-2 ring-primary/20 border-primary/50" : ""
                                    }`}
                                onClick={() => setSelectedAgent(agent)}
                            >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Bot className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                                                    <Badge
                                                        variant={agent.status === "Active" ? "default" : "secondary"}
                                                        className="mt-1"
                                                    >
                                                        {agent.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                    </div>
                                        <CardDescription className="flex items-center gap-4 mt-2">
                                            <span className="text-xs">Type: {agent.type}</span>
                                            <span className="text-xs">Model: {agent.model}</span>
                                        </CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Last active: {agent.lastActive}</span>
                                            <Button variant="ghost" size="sm">
                                                <Activity className="w-4 h-4 mr-2" />
                                                Test
                                            </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                    {/* Agent Configuration */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                        <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Configuration
                                </CardTitle>
                                <CardDescription>
                                    Settings for {selectedAgent.name}
                                </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                    <Label htmlFor="agent-name">Agent Name</Label>
                                <Input id="agent-name" defaultValue={selectedAgent.name} />
                            </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agent-type">Type</Label>
                                    <Select defaultValue={selectedAgent.type.toLowerCase()}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sales">Sales</SelectItem>
                                            <SelectItem value="support">Support</SelectItem>
                                            <SelectItem value="research">Research</SelectItem>
                                            <SelectItem value="general">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            <div className="space-y-2">
                                <Label htmlFor="ws-url">WebSocket URL</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                        wss://
                                    </span>
                                        <Input
                                            id="ws-url"
                                            placeholder="api.agent.ai/v1/stream"
                                            className="rounded-l-none"
                                            defaultValue="api.example.com/ws"
                                        />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Encoding</Label>
                                    <Select defaultValue="mulaw">
                                        <SelectTrigger>
                                                <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                                <SelectItem value="mulaw">μ-law</SelectItem>
                                                <SelectItem value="pcm">PCM</SelectItem>
                                            <SelectItem value="opus">Opus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sample Rate</Label>
                                    <Select defaultValue="8000">
                                        <SelectTrigger>
                                                <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                                <SelectItem value="8000">8kHz</SelectItem>
                                                <SelectItem value="16000">16kHz</SelectItem>
                                                <SelectItem value="24000">24kHz</SelectItem>
                                                <SelectItem value="48000">48kHz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Authentication</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="api-key">API Key</Label>
                                        <Input
                                            id="api-key"
                                            type="password"
                                            defaultValue="sk-........................"
                                            readOnly
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            API key is managed securely
                                        </p>
                                </div>
                            </div>

                                <div className="pt-4 space-y-2">
                                    <Button className="w-full">
                                        Save Changes
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Test Connection
                                    </Button>
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
