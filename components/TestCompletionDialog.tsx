"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TestCompletionDialogProps {
  isOpen: boolean
  onClose: () => void
  testSuiteName: string
  status: 'completed' | 'failed' | 'partial'
  passedTests: number
  totalTests: number
  duration: string
}

export function TestCompletionDialog({
  isOpen,
  onClose,
  testSuiteName,
  status,
  passedTests,
  totalTests,
  duration
}: TestCompletionDialogProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />
      case 'partial':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'completed':
        return 'Test Suite Completed Successfully!'
      case 'failed':
        return 'Test Suite Failed'
      case 'partial':
        return 'Test Suite Completed with Issues'
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Partial</Badge>
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <AlertDialogTitle className="text-left">
                {getStatusTitle()}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Test suite "{testSuiteName}" has finished execution
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Status</p>
              {getStatusBadge()}
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tests Passed</p>
              <p className="font-medium">{passedTests}/{totalTests}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium">
                {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            View Details
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
