"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Assistant {
  id: string
  name: string
}

interface AssistantComboboxProps {
  assistants: Assistant[]
  value?: string
  onValueChange: (value: string) => void
  onAddAssistant?: () => void
  placeholder?: string
  className?: string
}

export function AssistantCombobox({
  assistants,
  value,
  onValueChange,
  onAddAssistant,
  placeholder = "Select assistant...",
  className
}: AssistantComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleValueChange = (currentValue: string) => {
    if (currentValue === "add-assistant") {
      onAddAssistant?.()
    } else {
      onValueChange(currentValue)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search assistants..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-9"
      />
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className={`bg-background/50 border-border/50 ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredAssistants.map((assistant) => (
            <SelectItem key={assistant.id} value={assistant.id}>
              {assistant.name}
            </SelectItem>
          ))}
          <SelectItem value="add-assistant" className="text-primary font-medium">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Assistant
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
