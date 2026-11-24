import type { Metadata } from "next"
import { connection } from "next/server"

import { BrowseServicesClient } from "@/components/browse-services/browse-services-client"
import { getActiveServices } from "@/lib/services"

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Explore the salon services available to book.",
}

export default async function BrowseServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string
    duration?: string
  }>
}) {
  await connection()

  const params = await searchParams

  const services = await getActiveServices()

  const filteredServices = services.filter((service) => {
    const matchName = params.name
      ? service.name.toLowerCase().includes(params.name.toLowerCase())
      : true

    const matchDuration = params.duration
      ? service.duration === Number(params.duration)
      : true

    return matchName && matchDuration
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Browse Services
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Explore our available salon and barber services.
        </p>
      </header>

      <BrowseServicesClient services={filteredServices} />
    </div>
  )
}
