"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { removeService } from "@/lib/service-actions"

export function DeleteServiceButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return

    setIsDeleting(true)
    const result = await removeService(id)

    if (!result.ok) {
      setIsDeleting(false)
      window.alert(result.error)
      return
    }

    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label={`Delete ${name}`}
      title={`Delete ${name}`}
    >
      {isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
    </Button>
  )
}
