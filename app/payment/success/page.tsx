import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Hash,
  Home,
  Mail,
  Receipt,
  ShieldCheck,
} from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const {
    id,
    status,
    payment_status,
    customer_details,
    amount_total,
    currency,
    created,
    payment_intent,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  if (status === "open") {
    redirect("/")
  }

  if (status !== "complete") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <Receipt size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Payment not completed
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This checkout session is no longer active. If you were charged,
            please contact our support team.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  await checkoutVerify(session_id)

  const transactionId =
    payment_intent && typeof payment_intent === "object"
      ? payment_intent.id
      : payment_intent

  const currencyCode = (currency ?? "usd").toUpperCase()
  const locale = currencyCode === "BDT" ? "en-BD" : "en-US"
  const formatMoney = (value: number | null | undefined) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format((value ?? 0) / 100)

  const paidAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(created * 1000))

  const items = line_items?.data ?? []

  return (
    
<div className="min-h-screen bg-gray-50 px-3 py-8 sm:px-4 sm:py-10 dark:bg-gray-950">
  <div className="mx-auto w-full max-w-xl">

    {/* Back Button */}
    <Link
      href="/"
      className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-primary"
    >
      <ArrowLeft size={16} />
      Back to Home
    </Link>

    {/* Header */}
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-50 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/5">
        <CheckCircle2 size={28} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
        Payment Successful
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Thank you for your payment. Your appointment is confirmed.
      </p>
    </div>

    {/* Receipt Card */}
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* Amount Paid */}
      <div className="border-b border-gray-100 p-5 text-center sm:p-6 dark:border-gray-800">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
          <CheckCircle2 size={14} />
          {payment_status === "paid"
            ? "Paid"
            : (payment_status ?? "Unknown")}
        </span>

        <p className="mt-3 text-sm text-gray-500">Amount paid</p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          {formatMoney(amount_total)}
        </p>

        {customer_details?.email && (
          <p className="mt-3 text-sm text-gray-500">
            A receipt has been sent to{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300 break-all">
              {customer_details.email}
            </span>
          </p>
        )}
      </div>

      {/* Payment Details */}
      <div className="border-b border-gray-100 p-5 sm:p-6 dark:border-gray-800">
        <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
          Payment Details
        </h2>

        {/* Transaction ID */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
            <Hash size={14} />
            Transaction ID
          </div>

          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 font-mono text-xs sm:text-sm break-all text-gray-900 dark:text-white">
              {transactionId ?? "—"}
            </code>

            {transactionId && (
              <CopyButton
                value={transactionId}
                label="Copy transaction ID"
              />
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={16} className="shrink-0" />
              Date
            </span>
            <span className="text-right text-sm font-medium text-gray-900 dark:text-white">
              {paidAt}
            </span>
          </div>

          {customer_details?.email && (
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={16} className="shrink-0" />
                Email
              </span>
              <span className="max-w-[65%] text-right text-sm font-medium break-all text-gray-900 dark:text-white">
                {customer_details.email}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <CreditCard size={16} className="shrink-0" />
              Checkout Session
            </span>

            <span className="flex min-w-0 max-w-[65%] items-center gap-2">
              <code className="min-w-0 truncate font-mono text-xs text-gray-700 dark:text-gray-300">
                {id}
              </code>
              <CopyButton value={id} label="Copy checkout session ID" />
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
          Order Summary
        </h2>

        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-gray-500">
              No items to display.
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="min-w-0 text-gray-600 dark:text-gray-300">
                {item.description ?? "Item"}
                {item.quantity && item.quantity > 1
                  ? ` × ${item.quantity}`
                  : ""}
              </span>

              <span className="shrink-0 font-medium text-gray-900 dark:text-white">
                {formatMoney(item.amount_total)}
              </span>
            </div>
          ))}

          <div className="my-3 border-t border-dashed border-gray-200 dark:border-gray-700" />

          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-gray-900 dark:text-white">
              Total
            </span>

            <span className="text-xl font-bold text-primary sm:text-2xl">
              {formatMoney(amount_total)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Link
            href="/dashboard/customer/my-appointments"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] sm:text-base"
          >
            <CalendarDays size={18} />
            View My Appointments
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
          <ShieldCheck size={16} className="shrink-0 text-green-500" />
          Your payment was securely processed by Stripe.
        </div>
      </div>
    </div>

    <p className="mt-5 text-center text-xs text-gray-400">
      Need help with this payment?{" "}
      <a
        href="mailto:orders@example.com"
        className="font-medium text-gray-600 hover:text-primary dark:text-gray-300"
      >
        Contact support
      </a>
      .
    </p>
  </div>
</div>

  )
}
