
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Pencil,
  Clock,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { getServices } from "@/lib/api/services"
import { toggleServiceStatus } from "./actions"
// import DeleteServiceButton from "./DeleteServiceButton"
import { DeleteServicesDialog } from "@/components/DeleteServiceDialouge"
import { Service } from "@/lib/service-types"

export type ServiceStatus = "active" | "inactive"



interface ManageServicePageProps {
  searchParams: Promise<{
    search?: string
    category?: string
  }>
}

const ManageServicePage = async ({
  searchParams,
}: ManageServicePageProps) => {

  // Fetch services from server
  const services: Service[] = await getServices()

  // Get URL search params
  const params = await searchParams

  const search = params.search || ""
  const category = params.category || "all"

  // Get unique categories
  const categories = [
    ...new Set(services.map((service) => service.category)),
  ]

  // Search and filter
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === "all" || service.category === category

    return matchesSearch && matchesCategory
  })

  // Statistics
  const activeCount = services.filter(
    (service) => service.status === "active"
  ).length

  const inactiveCount = services.length - activeCount

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Services
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage, update and monitor all your services.
          </p>
        </div>

        <Link href="/dashboard/admin/add-services">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Services
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {services.length}
              </h2>
            </div>

            <Package className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Active Services
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {activeCount}
              </h2>
            </div>

            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Inactive Services
              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-500">
                {inactiveCount}
              </h2>
            </div>

            <div className="h-3 w-3 rounded-full bg-orange-500" />
          </CardContent>
        </Card>

      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>

          <CardDescription>
            View and manage all available services.
          </CardDescription>
        </CardHeader>

        <CardContent>

          {/* Search and Filter */}
          <form
            method="GET"
            className="mb-5 flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="search"
                defaultValue={search}
                placeholder="Search services..."
                className="pl-9"
              />
            </div>

            <select
              name="category"
              defaultValue={category}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-50"
            >
              <option value="all">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>

          </form>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-md border">

            <Table className="min-w-262">

              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (

                    <TableRow key={service._id}>

                      {/* Service */}
                      <TableCell>
                        <div className="flex items-center gap-3">

                          <Image
                            width={80}
                            height={60}
                            src={service.image}
                            alt={service.name}
                            className="h-11 w-11 rounded-md object-cover"
                          />

                          <div className="max-w-55">
                            <p className="font-medium">
                              {service.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {service.description}
                            </p>
                          </div>

                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline">
                          {service.category}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <span className="font-medium">
                          ${service.price.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Duration */}
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {service.duration} min
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={
                            service.status === "active"
                              ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                              : "border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100"
                          }
                        >
                          {service.status}
                        </Badge>
                      </TableCell>

                      {/* Availability */}
                      <TableCell>
                        <form
                          action={toggleServiceStatus.bind(
                            null,
                            service._id,
                            service.status === "active" ? "Active" : "Inactive"
                          )}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            variant={
                              service.status === "active"
                                ? "outline"
                                : "default"
                            }
                          >
                            {service.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                        </form>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">

                          <Link
                            href={`/dashboard/admin/manage-services/${service._id}/edit`}
                          >
                            <Button
                              size="icon"
                              variant="outline"
                              title="Edit service"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

                          <DeleteServicesDialog service={service}/>

                        </div>
                      </TableCell>

                    </TableRow>

                  ))
                ) : (

                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No services found.
                    </TableCell>
                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

          {/* Footer */}
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </p>

        </CardContent>
      </Card>

    </div>
  )
}

export default ManageServicePage
