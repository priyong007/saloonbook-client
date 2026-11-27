"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { CreditCard, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const PaymentPage = () => {
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")

  // Dummy payment information for now
  const paymentInfo = {
    serviceName: "Premium Haircut",
    appointmentDate: "November 28, 2026",
    appointmentTime: "10:30 AM",
    customerName: "John Doe",
    price: 1200,
    serviceFee: 50,
    total: 1250,
  }

  const handlePayment = () => {
    // TODO: Integrate Stripe Checkout here
    console.log("Redirecting to Stripe Checkout...")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Canceled Payment Message */}
        {canceled && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            Payment was canceled. Please try again when you&apos;re ready.
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard size={28} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your booking details and proceed with payment.
          </p>
        </div>

        {/* Payment Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Booking Information */}
          <div className="border-b border-gray-100 p-6 dark:border-gray-800">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Booking Information
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Service</span>
                <span className="text-right text-sm font-medium text-gray-900 dark:text-white">
                  {paymentInfo.serviceName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Customer</span>
                <span className="text-right text-sm font-medium text-gray-900 dark:text-white">
                  {paymentInfo.customerName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Appointment Date</span>
                <span className="text-right text-sm font-medium text-gray-900 dark:text-white">
                  {paymentInfo.appointmentDate}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Appointment Time</span>
                <span className="text-right text-sm font-medium text-gray-900 dark:text-white">
                  {paymentInfo.appointmentTime}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Payment Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Service Price</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ৳{paymentInfo.price.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ৳{paymentInfo.serviceFee.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="my-4 border-t border-dashed border-gray-200 dark:border-gray-700" />

              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary">
                  ৳{paymentInfo.total.toLocaleString("en-BD")}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-7 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white">
                  <CreditCard size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Secure Online Payment
                  </p>
                  <p className="text-xs text-gray-500">
                    Powered by Stripe (Coming Soon)
                  </p>
                </div>

                <div className="ml-auto shrink-0">
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
              </div>
            </div>

            

            <form action="/api/checkout_sessions" method="POST">
              <section>
                {/* Pay Button */}
            <button
            type="submit" role="link"
              onClick={handlePayment}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
            >

              Pay ৳{paymentInfo.total.toLocaleString("en-BD")} Now
            </button>
              </section>
            </form>

            {/* Security Note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
              <ShieldCheck size={16} className="shrink-0 text-green-500" />
              Your payment information will be securely processed.
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By proceeding, you agree to complete the payment for your appointment.
        </p>
      </div>
    </div>
  )
}

export default PaymentPage
