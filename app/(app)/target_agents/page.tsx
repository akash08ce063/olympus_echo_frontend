"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Bot,
    Plus,
    MoreHorizontal,
    Trash2,
    Edit,
    Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"
import { useAuth } from "@/hooks/useAuth"
import { TargetAgentsService } from "@/services/targetAgents"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"



export default function TesterAgentsPage() {
    const { user } = useAuth()
    const [agents, setAgents] = useState<Assistant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)
    const [isDeleteAgentOpen, setIsDeleteAgentOpen] = useState(false)
    const [isDeletingAgent, setIsDeletingAgent] = useState(false)
    const [agentToDelete, setAgentToDelete] = useState<Assistant | null>(null)

    const fetchAgents = useCallback(async () => {
        if (!user?.id) return
        setIsLoading(true)
        try {
            const response = await TargetAgentsService.getTargetAgents(user.id) as any
            const agentsList = response?.target_agents || []

            const transformedAgents: Assistant[] = agentsList.map((agent: any) => ({
                id: agent.id,
                name: agent.name,
                websocketUrl: agent.websocket_url,
                sampleRate: agent.sample_rate.toString(),
                encoding: agent.encoding,
                createdAt: new Date(agent.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                })
            }))

            setAgents(transformedAgents)
        } catch (error) {
            console.error("Failed to fetch agents:", error)
            toast.error("Failed to load agents")
        } finally {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAgents()
    }, [fetchAgents])

    const handleAddAssistant = (newAssistant: Assistant) => {
        fetchAgents() // Re-fetch all agents from the backend to ensure consistency
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
            await TargetAgentsService.deleteTargetAgent(agentToDelete.id);
            setAgents(prev => prev.filter(assistant => assistant.id !== agentToDelete.id));
            toast.success("Target agent deleted successfully");
            setIsDeleteAgentOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            console.error("Failed to delete agent:", error);
            toast.error("Failed to delete agent");
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
                        <h1 className="text-3xl font-bold tracking-tight">Target Agents</h1>
                        <p className="text-muted-foreground">
                            Manage the client agents you want to test
                        </p>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Target Agent
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
                    agentType="target"
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
                            <AlertDialogCancel disabled={isDeletingAgent} onClick={()=> setIsDeleteAgentOpen(false) }>Cancel</AlertDialogCancel>
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
