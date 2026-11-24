
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { ServiceCard } from "@/components/browse-services/service-card"
import {
  DEFAULT_SERVICE_FILTERS,
  ServiceFilters,
  type ServiceFilterValues,
} from "@/components/browse-services/service-filters"
import type { Service } from "@/lib/service-types"

type BrowseServicesClientProps = {
  services: Service[]
}

export function BrowseServicesClient({
  services,
}: BrowseServicesClientProps) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<ServiceFilterValues>({
    ...DEFAULT_SERVICE_FILTERS,
    search: searchParams.get("name") || "",
  })

  const categories = React.useMemo(
    () =>
      Array.from(new Set(services.map((service) => service.category))).sort(
        (first, second) => first.localeCompare(second)
      ),
    [services]
  )

  function handleSearchChange(value: string) {
    setFilters((previous) => ({
      ...previous,
      search: value,
    }))
  }

  function handleFilterChange(
    key: keyof ServiceFilterValues,
    value: string
  ) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <ServiceFilters
        values={filters}
        categories={categories}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {services.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {services.length}{" "}
            {services.length === 1 ? "service" : "services"}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No services available right now. Please check back soon.
        </div>
      )}
    </div>
  )
}
