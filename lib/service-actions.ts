"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import {
  createService,
  deleteService as deleteServiceRecord,
  updateService,
} from "@/lib/services"
import type { ServiceInput, ServiceStatus } from "@/lib/service-types"

export type ServiceActionResult = { ok: true } | { ok: false; error: string }

async function requireAdmin(): Promise<ServiceActionResult> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return { ok: false, error: "Please sign in to continue." }
  }

  if (session.user.role !== "admin") {
    return { ok: false, error: "Only admins can manage services." }
  }

  return { ok: true }
}

type ParsedServiceInput =
  { ok: false; error: string } | { ok: true; data: ServiceInput }

function parseServiceInput(input: ServiceInput): ParsedServiceInput {
  const name = String(input.name ?? "").trim()
  const category = String(input.category ?? "").trim()
  const description = String(input.description ?? "").trim()
  const price = Number(input.price)
  const duration = Number(input.duration)
  const image = typeof input.image === "string" ? input.image : ""
  const status: ServiceStatus =
    input.status === "inactive" ? "inactive" : "active"

  if (!name) {
    return { ok: false, error: "Service name is required." }
  }

  if (!category) {
    return { ok: false, error: "Service category is required." }
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "Price must be a positive number." }
  }

  if (!Number.isFinite(duration) || duration <= 0) {
    return { ok: false, error: "Duration must be a positive number." }
  }

  if (image && !image.startsWith("data:image/")) {
    return { ok: false, error: "Please upload a valid service image." }
  }

  return {
    ok: true,
    data: {
      name,
      category,
      description,
      price,
      duration,
      image,
      status,
    } satisfies ServiceInput,
  }
}

export async function saveService(
  id: string | null,
  input: ServiceInput
): Promise<ServiceActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return admin

  const parsed = parseServiceInput(input)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  if (id) {
    const updated = await updateService(id, parsed.data)
    if (!updated) {
      return { ok: false, error: "Service not found." }
    }
  } else {
    await createService(parsed.data)
  }

  revalidatePath("/dashboard/admin/manage-services")
  revalidatePath("/dashboard/admin/add-services")

  return { ok: true }
}

export async function removeService(id: string): Promise<ServiceActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return admin

  const deleted = await deleteServiceRecord(id)
  if (!deleted) {
    return { ok: false, error: "Service not found." }
  }

  revalidatePath("/dashboard/admin/manage-services")

  return { ok: true }
}
