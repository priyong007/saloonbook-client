import { notFound } from "next/navigation"

import { ServiceForm } from "@/components/service-form"
import { requireAdminPage } from "@/lib/require-admin"
import { getServiceById } from "@/lib/services"

export default async function AddServicePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>
}) {
  await requireAdminPage()

  const params = await searchParams
  const id = typeof params.id === "string" ? params.id : undefined

  if (id) {
    const service = await getServiceById(id)

    if (!service) {
      notFound()
    }

    return <ServiceForm service={service} />
  }

  return <ServiceForm />
}
