import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react"

import { getServiceById } from "@/lib/api/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const ServicesDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service || service.status !== "active") {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Back Navigation */}
        <Link
          href="/browse-services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
          {/* Left Content */}
          <section className="min-w-0 space-y-8">
            {/* Service Image */}
            <div className="group relative aspect-16/10 overflow-hidden rounded-3xl bg-muted shadow-sm">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

              <div className="absolute top-5 left-5">
                <Badge className="border border-white/30 bg-white/95 px-4 py-1.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-white">
                  {service.category}
                </Badge>
              </div>

              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Salon Experience
              </div>
            </div>

            {/* Service Heading */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 border-green-200 bg-green-50 px-3 py-1 text-green-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Available Now
                </Badge>

                <span className="text-sm text-muted-foreground">
                  Professional Salon Service
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  {service.name}
                </h1>

                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground">
                    Service Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ৳{service.price}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <Clock3 className="h-5 w-5 text-amber-600" />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground">
                    Duration
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {service.duration} min
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* About Service */}
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[2px] text-primary uppercase">
                  Service Information
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  About This Service
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <h3 className="mt-1 font-semibold text-gray-900">
                        {service.category}
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <Clock3 className="h-5 w-5 text-amber-600" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Estimated Time
                      </p>
                      <h3 className="mt-1 font-semibold text-gray-900">
                        {service.duration} Minutes
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Trust Information */}
            <div className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50/70 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <ShieldCheck className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Safe & Secure Booking
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Your appointment request is handled securely. Final payment
                  details will be confirmed by the salon.
                </p>
              </div>
            </div>
          </section>

          {/* Right Booking Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <Card className="overflow-hidden rounded-3xl border-gray-100 bg-[#f8f3ed] shadow-lg shadow-gray-200/50">
              <CardHeader className="space-y-3 border-b border-gray-100 bg-white p-6 sm:p-7">
                <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/10">
                  <CalendarDays className="mr-1 h-3.5 w-3.5" />
                  Appointment
                </Badge>

                <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                  Ready to book?
                </CardTitle>

                <CardDescription className="leading-6">
                  Enjoy a premium salon experience. Book your appointment in
                  just a few steps.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-6 sm:p-7">
                {/* Selected Service */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Your Selected Service
                  </p>

                  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {service.name}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {service.category}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Booking Summary
                  </h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Price</span>

                    <span className="font-semibold text-gray-900">
                      ৳{service.price}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>

                    <span className="font-medium text-gray-900">
                      {service.duration} minutes
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ৳{service.price}
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-muted-foreground">
                    Final payment details will be confirmed by the salon.
                  </p>
                </div>

                {/* Booking Button */}
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full rounded-xl text-sm font-semibold shadow-md"
                >
                  <Link
                    href={`/book-appointment/${service._id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <CalendarDays className="h-5 w-5 shrink-0" />
                    <span>Book Appointment</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secure and easy appointment booking
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ServicesDetailsPage
