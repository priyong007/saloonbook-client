
"use client"

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Clock,
  Loader2,
  Scissors,
  XCircle,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { cancelAppointment, getMyAppointments } from "@/lib/api/appointment"

interface Appointment {
  _id: string
  userId?: string
  userEmail?: string
  serviceId?: string
  serviceName: string
  serviceImage?: string
  image?: string
  category?: string
  price: number
  duration?: number
  appointmentDate: string
  appointmentTime: string
  appointmentStatus?: string
  status?: string
  paymentStatus?: string
  createdAt: string
}

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
]

const MyAppointmentsPage = () => {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [error, setError] = useState("")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  // Normalize appointment status
  const getAppointmentStatus = (appointment: Appointment) => {
    return (
      appointment.appointmentStatus ||
      appointment.status ||
      "pending"
    ).toLowerCase()
  }

  // Normalize payment status
  const getPaymentStatus = (appointment: Appointment) => {
    return (appointment.paymentStatus || "unpaid").toLowerCase()
  }

  // Fetch appointments by user ID
  const fetchAppointments = useCallback(async () => {
    const userId = session?.user?.id

    if (!userId) {
      setAppointments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const data = await getMyAppointments(userId)

      setAppointments(data.result || [])
    } catch (err) {
      console.error(err)
      setError("Failed to load appointments. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  // Load appointments
  useEffect(() => {
    if (isPending) return

    let ignore = false

    const loadAppointments = async () => {
      if (!session?.user?.id) {
        setAppointments([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const data = await getMyAppointments(session.user.id)

        if (!ignore) {
          setAppointments(data.result || [])
        }
      } catch (err) {
        console.error(err)

        if (!ignore) {
          setError("Failed to load appointments. Please try again.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadAppointments()

    return () => {
      ignore = true
    }
  }, [session?.user?.id, isPending])

  // Cancel pending appointment
const handleCancelAppointment = async (appointment: Appointment) => {
  if (getAppointmentStatus(appointment) !== "pending") {
    toast.error("Only pending appointments can be cancelled.")
    return
  }

  const confirmed = window.confirm(
    "Are you sure you want to cancel this appointment?"
  )

  if (!confirmed) return

  try {
    setCancellingId(appointment._id)

    await cancelAppointment(appointment._id)

    setAppointments((previous) =>
      previous.map((item) =>
        item._id === appointment._id
          ? {
              ...item,
              status: "cancelled",
              appointmentStatus: "cancelled",
            }
          : item
      )
    )

    toast.success("Appointment cancelled successfully.")
  } catch (error) {
    console.error(error)

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to cancel appointment"
    )
  } finally {
    setCancellingId(null)
  }
}

  // Payment navigation
  const handlePayment = (appointment: Appointment) => {
    const status = getAppointmentStatus(appointment)
    const paymentStatus = getPaymentStatus(appointment)

    if (status !== "confirmed" || paymentStatus !== "unpaid") {
      toast.error("This appointment is not eligible for payment.")
      return
    }

    router.push(
      `/dashboard/payment?appointmentId=${encodeURIComponent(appointment._id)}`
    )
  }

  // Date formatting
  const formatDate = (date: string) => {
    if (!date) return "N/A"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return "N/A"

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Requested date formatting
  const formatRequestedDate = (date: string) => {
    if (!date) return "N/A"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return "N/A"

    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Appointment status styles
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700"

      case "pending":
        return "bg-amber-50 text-amber-700"

      case "cancelled":
        return "bg-red-50 text-red-700"

      case "completed":
        return "bg-blue-50 text-blue-700"

      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Payment status styles
  const getPaymentStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-700"

      case "unpaid":
        return "bg-amber-50 text-amber-700"

      case "refunded":
        return "bg-blue-50 text-blue-700"

      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Filter appointments
  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter(
          (appointment) =>
            getAppointmentStatus(appointment) === activeFilter
        )

  // Loading state
  if (isPending || loading) {
    return (
      <div className="flex min-h-400px items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#693c4b]" />
      </div>
    )
  }

  // Authentication check
  if (!session?.user?.id) {
    return (
      <div className="flex min-h-400px flex-col items-center justify-center gap-4 px-4 text-center">
        <CalendarDays className="h-12 w-12 text-gray-300" />

        <h2 className="text-xl font-semibold text-[#392c2c]">
          Please login to view your appointments.
        </h2>

        <Link
          href="/sign-in"
          className="rounded-full bg-[#693c4b] px-6 py-3 text-sm text-white transition hover:bg-[#512d39]"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f3eb] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-800 uppercase">
              Your Bookings
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#392c2c]">
              My Appointments
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your appointments, check booking status and make payments.
            </p>
          </div>

          <Link
            href="/browse-services"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#693c4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#512d39]"
          >
            <Scissors size={16} />
            Book a Service
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <h3 className="mt-2 text-3xl font-semibold text-[#693c4b]">
              {appointments.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="mt-2 text-3xl font-semibold text-amber-600">
              {
                appointments.filter(
                  (a) => getAppointmentStatus(a) === "pending"
                ).length
              }
            </h3>
          </div>

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Confirmed</p>
            <h3 className="mt-2 text-3xl font-semibold text-emerald-600">
              {
                appointments.filter(
                  (a) => getAppointmentStatus(a) === "confirmed"
                ).length
              }
            </h3>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "border-[#693c4b] bg-[#693c4b] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#693c4b]"
              }`}
            >
              {filter.label}

              {filter.value === "all" && (
                <span className="ml-1">({appointments.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchAppointments}
              disabled={loading}
              className="flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* Appointment List */}
        <div className="">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment)
              const paymentStatus = getPaymentStatus(appointment)

              const canCancel = status === "pending"
              const canPay =
                status === "confirmed" && paymentStatus === "unpaid"

              return (
                <div
                  key={appointment._id}
                  className="overflow-hidden rounded-sm border border-[#eadfd3] bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Main Row */}
                  <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_minmax(250px,1.3fr)_auto_auto] xl:items-center xl:gap-5">

                    {/* Service Information */}
                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 ">
                      <p className="text-xs font-medium tracking-wider whitespace-nowrap text-amber-800 uppercase">
                        {appointment.category || "Salon Service"}
                      </p>

                      <h3 className="truncate text-base font-semibold text-[#392c2c]">
                        {appointment.serviceName}
                      </h3>

                      <p className="text-base font-semibold whitespace-nowrap text-[#693c4b]">
                        ৳{appointment.price}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-wrap items-center gap-x-5 text-sm text-gray-600">
                      <p className="flex items-center gap-2 whitespace-nowrap">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-[#693c4b]"
                        />
                        {formatDate(appointment.appointmentDate)}
                      </p>

                      <p className="flex items-center gap-2 whitespace-nowrap">
                        <Clock
                          size={17}
                          className="shrink-0 text-[#693c4b]"
                        />
                        {appointment.appointmentTime}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(status)}`}
                      >
                        ● {status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPaymentStyle(paymentStatus)}`}
                      >
                        ● {paymentStatus}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 sm:col-span-2 xl:col-span-1 xl:border-0 xl:pt-0">
                      <Link
                        href={`/payment`}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-gray-200 px-3 py-2 text-sm font-medium whitespace-nowrap text-purple-700 transition hover:bg-gray-50"
                      >
                        {/* <Eye size={15} /> */}
                        Pay Now
                      </Link>

                      {canCancel && (
                        <button
                          type="button"
                          disabled={cancellingId === appointment._id}
                          onClick={() => handleCancelAppointment(appointment)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium whitespace-nowrap text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId === appointment._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <XCircle size={15} />
                          )}
                          Cancel
                        </button>
                      )}

                      {canPay && (
                        <button
                          type="button"
                          onClick={() => handlePayment(appointment)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#693c4b] px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition hover:bg-[#512d39]"
                        >
                          <CreditCard size={15} />
                          Pay Now
                        </button>
                      )}

                      {status === "confirmed" && paymentStatus === "paid" && (
                        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium whitespace-nowrap text-emerald-700">
                          Payment Completed
                        </span>
                      )}

                      {status === "cancelled" && (
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-500">
                          Appointment Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="border-t border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-400">
                      Requested on: {formatRequestedDate(appointment.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-[#eadfd3] bg-white px-5 py-20 text-center">
              <CalendarDays className="mx-auto mb-4 h-14 w-14 text-gray-300" />

              <h3 className="text-xl font-semibold text-[#392c2c]">
                No Appointments Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {activeFilter === "all"
                  ? "You haven't booked any appointments yet."
                  : `You don't have any ${activeFilter} appointments.`}
              </p>

              <Link
                href="/browse-services"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#693c4b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#512d39]"
              >
                <Scissors size={16} />
                Browse Services
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAppointmentsPage
