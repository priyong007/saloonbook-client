"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterOption = {
  value: string
  label: string
}

type FilterSelectProps = {
  id: string
  label: string
  value: string
  options: readonly FilterOption[]
  onValueChange: (value: string) => void
}

export function FilterSelect({
  id,
  label,
  value,
  options,
  onValueChange,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Select
        items={options}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange(nextValue)
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
