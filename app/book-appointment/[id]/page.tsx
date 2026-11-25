
import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getServiceById } from "@/lib/api/services"
import { BookingForm } from "@/app/(main)/browse-services/[id]/booking-form"

const BookAppointmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  // Check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect(
      `/sign-in?callbackUrl=${encodeURIComponent(
        `/book-appointment/${id}`
      )}`
    )
  }

  // Get service details
  const service = await getServiceById(id)

  if (!service || service.status !== "active") {
    notFound()
  }

  return (
    <main className="min-h-screen w-full bg-[#faf9f7] px-3 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-12">

      <div className="mx-auto w-full max-w-[1600px]">

        <BookingForm
          serviceId={service._id}
          serviceName={service.name}
          category={service.category}
          price={service.price}
          duration={service.duration}
          userName={session.user.name}
          userEmail={session.user.email}
          image={service.image}
        />

      </div>

    </main>
  )
}

export default BookAppointmentPage

