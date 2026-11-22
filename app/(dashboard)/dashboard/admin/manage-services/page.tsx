/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { ImageIcon, PencilIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DeleteServiceButton } from "@/components/delete-service-button"
import { requireAdminPage } from "@/lib/require-admin"
import { getServices } from "@/lib/services"
import { cn } from "@/lib/utils"

export default async function ManageServicesPage() {
  await requireAdminPage()

  const services = await getServices()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl">Manage Services</h1>
          <p className="text-sm text-muted-foreground">
            View, edit, or remove the services on your salon menu.
          </p>
        </div>
        <Button render={<Link href="/dashboard/admin/add-services" />}>
          <PlusIcon />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ImageIcon className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No services yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first service to start building your salon menu.
              </p>
            </div>
            <Button
              variant="outline"
              render={<Link href="/dashboard/admin/add-services" />}
            >
              <PlusIcon />
              Add Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted text-muted-foreground">
                  <ImageIcon className="size-8" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.category}</CardDescription>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      service.status === "active"
                        ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {service.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                {service.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    ${service.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    {service.duration} min
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    render={
                      <Link
                        href={`/dashboard/admin/add-services?id=${service.id}`}
                      />
                    }
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                  <DeleteServiceButton id={service.id} name={service.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
