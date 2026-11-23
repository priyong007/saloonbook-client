
"use server"

import { revalidatePath } from "next/cache"

const API_URL = process.env.API_URL

export async function deleteService(id: number) {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to delete service")
  }

  revalidatePath("/dashboard/admin/manage-services")
}

export async function toggleServiceStatus(
  id: string,
  currentStatus: "Active" | "Inactive"
) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active"

  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to update service status")
  }

  revalidatePath("/dashboard/admin/manage-services")
}
