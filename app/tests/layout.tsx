"use client";

import { TestProvider } from "@/context/TestContext";
import { TestSuiteSidebar } from "@/components/test-suite/TestSuiteSidebar";

export default function TestsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TestProvider>
            <div className="flex h-[calc(100vh-65px)] overflow-hidden">
                <TestSuiteSidebar />
                <main className="flex-1 overflow-auto bg-background">
                    {children}
                </main>
            </div>
        </TestProvider>
    );
}
