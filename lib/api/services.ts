
import type { Service } from "@/lib/service-types"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Get all services
export const getServices = async () => {
  const res = await fetch(`${BASE_URL}/services`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch services")
  }

  return res.json()
}

// Get single service by ID
export const getServiceById = async (
  id: string
): Promise<Service | null> => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    cache: "no-store",
  })

  if (res.status === 404) return null

  if (!res.ok) {
    throw new Error("Failed to fetch service details")
  }

  return res.json()
}
