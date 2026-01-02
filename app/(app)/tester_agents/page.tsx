"use client"

import { useState } from "react"
import {
    Bot,
    Plus,
    Search,
    MoreHorizontal,
    Settings,
    Play,
    Pause,
    Trash2,
    Eye,
    Copy,
    Edit
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TesterAgent {
    id: string
    name: string
    type: 'openai' | 'anthropic' | 'custom'
    model: string
    status: 'active' | 'inactive' | 'training'
    lastUsed: string
    testCount: number
    description: string
}

const mockAgents: TesterAgent[] = [
    {
        id: 'agent-1',
        name: 'GPT-4 Tester',
        type: 'openai',
        model: 'gpt-4-turbo',
        status: 'active',
        lastUsed: '2025-01-01 14:30',
        testCount: 45,
        description: 'Advanced tester using GPT-4 for complex conversation scenarios'
    },
    {
        id: 'agent-2',
        name: 'Claude Tester',
        type: 'anthropic',
        model: 'claude-3-sonnet',
        status: 'active',
        lastUsed: '2025-01-01 13:15',
        testCount: 32,
        description: 'Reliable tester using Claude for consistent test execution'
    },
    {
        id: 'agent-3',
        name: 'Custom Tester',
        type: 'custom',
        model: 'fine-tuned-v1',
        status: 'inactive',
        lastUsed: '2024-12-28 09:45',
        testCount: 12,
        description: 'Custom fine-tuned model for specific testing scenarios'
    }
]

export default function TesterAgentsPage() {
    const [agents, setAgents] = useState<TesterAgent[]>(mockAgents)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<TesterAgent | null>(null)

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: TesterAgent['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>
            case 'training':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Training</Badge>
        }
    }

    const getTypeBadge = (type: TesterAgent['type']) => {
        const colors = {
            openai: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            anthropic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
            custom: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
        }
        return <Badge className={colors[type]}>{type.toUpperCase()}</Badge>
    }

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Tester Agents</h1>
                    <p className="text-muted-foreground">
                        Manage your AI tester agents for automated testing
                    </p>
                </div>

                {/* Search and Create */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Agent
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-primary" />
                                    Create New Tester Agent
                                </DialogTitle>
                                <DialogDescription>
                                    Set up a new AI agent for automated testing
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="agentName">Agent Name</Label>
                                    <Input
                                        id="agentName"
                                        placeholder="e.g. Customer Service Tester"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agentType">Provider</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select AI provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="anthropic">Anthropic</SelectItem>
                                            <SelectItem value="custom">Custom Model</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                                            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                                            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the agent's role and testing focus..."
                                        className="min-h-[80px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsCreateOpen(false)}>
                                    Create Agent
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => (
                        <Card key={agent.id} className="hover:shadow-lg transition-all duration-200">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getTypeBadge(agent.type)}
                                                {getStatusBadge(agent.status)}
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Agent
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Agent
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Model: {agent.model}</span>
                                        <span>{agent.testCount} tests</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Last used: {agent.lastUsed}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        disabled={agent.status !== 'active'}
                                    >
                                        {agent.status === 'active' ? (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Test Now
                                            </>
                                        ) : (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" />
                                                {agent.status === 'training' ? 'Training' : 'Inactive'}
                                            </>
                                        )}
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredAgents.length === 0 && (
                    <Card className="border-dashed border-2 border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No tester agents found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? 'Try adjusting your search query.' : 'Create your first AI tester agent to get started.'}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Agent
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
