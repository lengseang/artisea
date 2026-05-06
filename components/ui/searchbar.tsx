'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { cn } from "@/lib/utils" // standard shadcn utility for merging classes

interface SearchBarProps extends React.FormHTMLAttributes<HTMLFormElement> {
  label?: string;
  placeholder?: string;
  buttonText?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  inputId?: string;
}

export function SearchBar({
  label,
  placeholder = "Type to search...",
  buttonText = "Search",
  defaultValue = "",
  onSearch,
  className,
  inputId = "search-input",
  ...props
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    // The cn() function merges the default width with any custom className you pass in
    <form onSubmit={handleSubmit} className={cn("w-full max-w-sm", className)} {...props}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        </div>
        <Input 
          id={inputId} 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring transition-all rounded-xl"
        />
      </div>
    </form>
  )
}