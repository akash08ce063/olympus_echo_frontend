export default function TestsEmptyPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template"><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="9" height="7" x="3" y="14" rx="1" /><rect width="5" height="7" x="16" y="14" rx="1" /></svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">No Suite Selected</h3>
            <p className="max-w-xs mt-2 text-sm">Select a test suite from the sidebar or create a new one to get started.</p>
        </div>
    );
}
