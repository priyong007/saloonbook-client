
"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  FilterSelect,
  type FilterOption,
} from "@/components/browse-services/filter-select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getServiceCategoryLabel } from "@/lib/service-types"

export type ServiceFilterValues = {
  search: string
  category: string
  price: string
  duration: string
  sort: string
}

export const DEFAULT_SERVICE_FILTERS: ServiceFilterValues = {
  search: "",
  category: "all",
  price: "all",
  duration: "all",
  sort: "newest",
}

const PRICE_OPTIONS: FilterOption[] = [
  { value: "all", label: "Any price" },
  { value: "under-500", label: "Under ৳500" },
  { value: "500-1000", label: "৳500 – ৳1000" },
  { value: "1000-2000", label: "৳1000 – ৳2000" },
  { value: "over-2000", label: "Above ৳2000" },
]

const DURATION_OPTIONS: FilterOption[] = [
  { value: "all", label: "Any duration" },
  { value: "under-30", label: "Under 30 min" },
  { value: "30-60", label: "30 – 60 min" },
  { value: "60-90", label: "60 – 90 min" },
  { value: "over-90", label: "90 min and above" },
]

const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "duration-desc", label: "Duration: Long to Short" },
]

type ServiceFiltersProps = {
  values: ServiceFilterValues
  categories: string[]
  onSearchChange: (value: string) => void
  onFilterChange: (
    key: keyof ServiceFilterValues,
    value: string
  ) => void
}

export function ServiceFilters({
  values,
  categories,
  onSearchChange,
  onFilterChange,
}: ServiceFiltersProps) {

  const router = useRouter()

  const categoryOptions: FilterOption[] = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({
      value: category,
      label: getServiceCategoryLabel(category),
    })),
  ]

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (values.search.trim()) {
      params.set("name", values.search.trim())
    }

    if (values.category !== "all") {
      params.set("category", values.category)
    }

    if (values.price !== "all") {
      params.set("price", values.price)
    }

    if (values.duration !== "all") {
      params.set("duration", values.duration)
    }

    if (values.sort !== "newest") {
      params.set("sort", values.sort)
    }

    router.push(
      `/browse-services${params.toString() ? `?${params.toString()}` : ""}`
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {/* Search */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-search">
          Search
        </Label>

        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="service-search"
            type="search"
            placeholder="Search services..."
            className="pl-9"
            value={values.search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>
      </div>

      {/* Category */}
      <FilterSelect
        id="service-category-filter"
        label="Category"
        value={values.category}
        options={categoryOptions}
        onValueChange={(value) =>
          onFilterChange("category", value)
        }
      />

      {/* Price */}
      <FilterSelect
        id="service-price-filter"
        label="Price"
        value={values.price}
        options={PRICE_OPTIONS}
        onValueChange={(value) =>
          onFilterChange("price", value)
        }
      />

      {/* Duration */}
      <FilterSelect
        id="service-duration-filter"
        label="Duration"
        value={values.duration}
        options={DURATION_OPTIONS}
        onValueChange={(value) =>
          onFilterChange("duration", value)
        }
      />

      {/* Sort */}
      <FilterSelect
        id="service-sort-filter"
        label="Sort by"
        value={values.sort}
        options={SORT_OPTIONS}
        onValueChange={(value) =>
          onFilterChange("sort", value)
        }
      />

      {/* Apply Filters */}
      <div className="sm:col-span-2 lg:col-span-5">
        <Button type="submit">
          Apply Filters
        </Button>
      </div>
    </form>
  )
}
