"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock, User, Mail, ArrowLeft } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type BookingFormProps = {
  serviceId: string
  serviceName: string
  category: string
  price: number
  duration: number
  userName: string
  userEmail: string
  image: string
}

const TIME_SLOTS = [
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
  "8:00 PM - 10:00 PM",
]

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export function BookingForm({
  serviceId,
  serviceName,
  category,
  image,
  price,
  duration,
  userName,
  userEmail,
}: BookingFormProps) {
  const router = useRouter()

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const today = new Date().toLocaleDateString("en-CA")

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!date || !time) {
      setError("Please select appointment date and time slot")
      return
    }

    if (date < today) {
      setError("Please select a valid appointment date")
      return
    }

    try {
      setLoading(true)

      // Check booking data in console
      console.log("Booking Data:", {
        serviceId,
        serviceName,
        category,
        price,
        duration,
        userName,
        userEmail,
        appointmentDate: date,
        appointmentTime: time,
      })

      const response = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          serviceName,
          category,
          price,
          duration,
          userName,
          userEmail,
          appointmentDate: date,
          appointmentTime: time,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Booking failed")
      }

      setSuccess("Your appointment has been booked successfully!")

      setTimeout(() => {
        router.push("/dashboard/my-appointments")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-none px-3 py-6 sm:px-6 lg:px-10 xl:px-12">
      {/* BACK TO SERVICES BUTTON */}
      <div className="mx-auto mb-5 w-full max-w-[1600px]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/browse-services")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl border-gray-100 shadow-lg">
        {/* HEADER */}
        <CardHeader className="bg-primary/5 p-5 sm:p-6 lg:p-8">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-xl font-bold sm:text-2xl">
            Book Your Appointment
          </CardTitle>

          <CardDescription>
            Complete the form below to reserve your salon service.
          </CardDescription>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-4 sm:p-6 lg:p-10 xl:p-12">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            {/* LEFT SIDE - SELECTED SERVICE */}
            <div className="w-full space-y-5">
              <h3 className="text-lg font-semibold sm:text-xl">
                Selected Service
              </h3>

              <div className="overflow-hidden rounded-xl border bg-muted/30">
                <div className="relative h-56 w-full sm:h-72 xl:h-80">
                  <Image
                    src={image}
                    alt={serviceName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="space-y-4 p-4 sm:p-6">
                  <div>
                    <h4 className="text-xl font-semibold">{serviceName}</h4>

                    <p className="text-sm text-muted-foreground">{category}</p>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Price</span>
                    <span className="font-semibold">৳{price}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{duration} minutes</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>

                    <span className="text-xl font-bold text-primary">
                      ৳{price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - CUSTOMER INFORMATION & BOOKING */}
            <div className="w-full space-y-6">
              {/* CUSTOMER INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold sm:text-xl">
                  Customer Information
                </h3>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Customer Name
                    </p>
                    <p className="font-medium wrap-break-word">{userName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email Address
                    </p>
                    <p className="font-medium break-all">{userEmail}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* APPOINTMENT SCHEDULE */}
              <form onSubmit={handleBooking} className="space-y-5">
                <h3 className="text-lg font-semibold sm:text-xl">
                  Appointment Schedule
                </h3>

                {/* DATE */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Select Appointment Date
                  </label>

                  <Input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={loading || !!success}
                    className="h-12 w-full"
                  />
                </div>

                {/* TIME SLOTS */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-primary" />
                    Select Appointment Time Slot
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TIME_SLOTS.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={time === slot ? "default" : "outline"}
                        onClick={() => {
                          setTime(slot)
                          setError("")
                        }}
                        disabled={loading || !!success}
                        className={`h-12 w-full text-xs sm:text-sm ${
                          time === slot
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                      >
                        <Clock className="mr-2 h-4 w-4 shrink-0" />
                        {slot}
                      </Button>
                    ))}
                  </div>

                  {time && (
                    <p className="text-sm font-medium text-primary">
                      Selected Time: {time}
                    </p>
                  )}
                </div>

                {/* ERROR */}
                {error && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                {/* SUCCESS */}
                {success && (
                  <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </p>
                )}

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={loading || !!success}
                  className="h-12 w-full text-base font-semibold"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Your appointment will be submitted for admin confirmation.
                </p>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
