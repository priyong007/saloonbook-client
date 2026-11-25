

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Get all appointment
export const getServices = async () => {
  const res = await fetch(`${BASE_URL}/appointments`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch services")
  }

  return res.json()
}
