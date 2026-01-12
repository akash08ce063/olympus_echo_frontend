"use client"

import { useState, useEffect, useCallback } from "react"
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
    Edit,
    Loader2
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
import { useAuth } from "@/hooks/useAuth"
import { UserAgentsService } from "@/services/userAgents"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserAgentsPage() {
    const { user } = useAuth()
    const [agents, setAgents] = useState<Assistant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)
    const [isDeleteAgentOpen, setIsDeleteAgentOpen] = useState(false)
    const [isDeletingAgent, setIsDeletingAgent] = useState(false)
    const [agentToDelete, setAgentToDelete] = useState<Assistant | null>(null)

    const fetchAgents = useCallback(async (silent = false) => {
        if (!user?.id) return
        if (!silent) setIsLoading(true)
        try {
            const response = await UserAgentsService.getUserAgents(user.id) as any
            const agentsList = response?.user_agents || []

            const transformedAgents: Assistant[] = agentsList.map((agent: any) => ({
                id: agent.id,
                name: agent.name,
                systemPrompt: agent.system_prompt,
                temperature: agent.temperature,
                createdAt: new Date(agent.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                })
            }))

            setAgents(transformedAgents)
        } catch (error) {
            console.error("Failed to fetch user agents:", error)
            toast.error("Failed to load tester agents")
        } finally {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAgents()
    }, [fetchAgents])

    const handleAddAssistant = (newAssistant: Assistant) => {
        fetchAgents(true) // Re-fetch all agents from the backend to ensure consistency
        setEditingAssistant(null)
        setIsAddDialogOpen(false)
    }

    const handleEditAssistant = (assistant: Assistant) => {
        setEditingAssistant(assistant)
        setIsAddDialogOpen(true)
    }

    const handleDeleteAssistant = async () => {
        if (!agentToDelete) return;

        setIsDeletingAgent(true);
        try {
            await UserAgentsService.deleteUserAgent(agentToDelete.id);
            setAgents(prev => prev.filter(assistant => assistant.id !== agentToDelete.id));
            toast.success("Tester agent deleted successfully");
            setIsDeleteAgentOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            console.error("Failed to delete tester agent:", error);
            toast.error("Failed to delete tester agent");
        } finally {
            setIsDeletingAgent(false);
        }
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
            accessorKey: "systemPrompt",
            header: "System Prompt",
            cell: ({ row }) => (
                <div className="max-w-75 truncate text-sm text-muted-foreground" title={row.getValue("systemPrompt")}>
                    {row.getValue("systemPrompt")}
                </div>
            )
        },
        {
            accessorKey: "temperature",
            header: "Temp",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono">
                    {Number(row.getValue("temperature")).toFixed(1)}
                </Badge>
            )
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
                            <DropdownMenuItem
                                onClick={() => {
                                    setAgentToDelete(assistant)
                                    setIsDeleteAgentOpen(true)
                                }}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
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
                            Manage your evaluation bots that test the target agents
                        </p>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Tester Agent
                    </Button>
                </div>

                {/* DataTable */}
                <div className="rounded-md border border-border/50 bg-card p-6 shadow-sm">
                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 px-2">
                                <Skeleton className="h-4 w-62.5" />
                                <Skeleton className="h-4 w-50" />
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-4 px-2 py-4 border-b border-border/50">
                                    <Skeleton className="h-10 w-10 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={agents}
                            searchKey="name"
                        />
                    )}
                </div>

                <AddAssistantDialog
                    open={isAddDialogOpen}
                    onOpenChange={handleCloseDialog}
                    onAddAssistant={handleAddAssistant}
                    initialData={editingAssistant}
                    agentType="tester"
                />

                <AlertDialog open={isDeleteAgentOpen} onOpenChange={setIsDeleteAgentOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the agent "{agentToDelete?.name}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeletingAgent} onClick={() => setIsDeleteAgentOpen(false)}>Cancel</AlertDialogCancel>
                            <Button
                                onClick={handleDeleteAssistant}
                                disabled={isDeletingAgent}
                                variant="destructive"
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeletingAgent ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
