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
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"

const mockAgents: Assistant[] = [
    {
        id: '1',
        name: 'GPT-4 Tester',
        websocketUrl: 'ws://api.openai.com/v1/tester',
        sampleRate: '16000',
        encoding: 'pcm_16',
        createdAt: '2025-01-01',
    },
    {
        id: '2',
        name: 'Claude Tester',
        websocketUrl: 'ws://api.anthropic.com/v1/tester',
        sampleRate: '16000',
        encoding: 'pcm_16',
        createdAt: '2025-01-01',
    },
    {
        id: '3',
        name: 'Custom Tester',
        websocketUrl: 'ws://localhost:8080/tester',
        sampleRate: '8000',
        encoding: 'mulaw',
        createdAt: '2024-12-28',
    }
]

export default function TesterAgentsPage() {
    const [agents, setAgents] = useState<Assistant[]>(mockAgents)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)

    const handleAddAssistant = (newAssistant: Assistant) => {
        if (editingAssistant) {
            setAgents(prev => prev.map(assistant =>
                assistant.id === editingAssistant.id
                    ? { ...newAssistant, id: editingAssistant.id } // Keep existing ID if editing
                    : assistant
            ))
            setEditingAssistant(null)
        } else {
            setAgents(prev => [newAssistant, ...prev])
        }
        setIsAddDialogOpen(false)
    }

    const handleEditAssistant = (assistant: Assistant) => {
        setEditingAssistant(assistant)
        setIsAddDialogOpen(true)
    }

    const handleDeleteAssistant = (id: string) => {
        setAgents(prev => prev.filter(assistant => assistant.id !== id))
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        setEditingAssistant(null)
    }

    const columns: ColumnDef<Assistant>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{row.getValue("name")}</span>
                </div>
            )
        },
        {
            accessorKey: "websocketUrl",
            header: "Websocket URL",
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {row.getValue("websocketUrl")}
                </code>
            )
        },
        {
            accessorKey: "sampleRate",
            header: "Sample Rate",
            cell: ({ row }) => <span>{row.getValue("sampleRate")} Hz</span>
        },
        {
            accessorKey: "encoding",
            header: "Encoding",
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.getValue("createdAt")}</span>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const assistant = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAssistant(assistant)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the agent "{assistant.name}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteAssistant(assistant.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Tester Agents</h1>
                        <p className="text-muted-foreground">
                            Manage your AI tester agents for automated testing
                        </p>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Agent
                    </Button>
                </div>

                {/* DataTable */}
                <div className="rounded-md border border-border/50 bg-card p-6 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={agents}
                        searchKey="name"
                    />
                </div>

                <AddAssistantDialog
                    open={isAddDialogOpen}
                    onOpenChange={handleCloseDialog}
                    onAddAssistant={handleAddAssistant}
                    initialData={editingAssistant}
                />
            </div>
        </div>
    )
}
