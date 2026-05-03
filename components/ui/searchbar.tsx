'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
      <Field>
        {/* Only render the label if one is provided */}
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        
        <ButtonGroup>
          <Input 
            id={inputId} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder} 
          />
          <Button type="submit" variant="outline">
            {buttonText}
          </Button>
        </ButtonGroup>
      </Field>
    </form>
  )
}