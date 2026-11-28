"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({
  value,
  label = "Copy to clipboard",
}: {
  value: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked by the browser; fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {copied ? (
        <Check size={14} className="text-green-600 dark:text-green-400" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  )
}
