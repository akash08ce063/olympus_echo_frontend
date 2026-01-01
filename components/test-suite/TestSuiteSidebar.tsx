"use client";

import { useTestContext } from "@/context/TestContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, FileText } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CreateSuiteDialog } from "@/components/test-suite/CreateSuiteDialog";

export function TestSuiteSidebar() {
    const { datasets } = useTestContext();
    const params = useParams();
    const pathname = usePathname();
    const activeId = params.id as string;
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Filter datasets (most recent first)
    const filtered = datasets
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="w-[300px] border-r bg-muted/10 flex flex-col h-full bg-card">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg tracking-tight">Test Suites</h2>
                    <span className="text-xs text-muted-foreground">Docs ↗</span>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Test Suite
                </Button>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suites..."
                        className="pl-8 h-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {filtered.map(dataset => (
                        <Link key={dataset.id} href={`/tests/${dataset.id}`}>
                            <div className={cn(
                                "group flex flex-col gap-1 p-3 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer relative",
                                activeId === dataset.id ? "bg-accent/80 text-accent-foreground border-l-2 border-emerald-500 rounded-l-none" : "text-muted-foreground"
                            )}>
                                <div className="font-medium text-foreground truncate">{dataset.name}</div>
                                <div className="text-[10px] opacity-70 flex justify-between">
                                    <span>
                                        {dataset.created_at ? new Date(dataset.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                    {dataset.cases.length > 0 && <span>{dataset.cases.length} cases</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-xs text-muted-foreground">
                            No suites found.
                        </div>
                    )}
                </div>
            </ScrollArea>

            <CreateSuiteDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
}
