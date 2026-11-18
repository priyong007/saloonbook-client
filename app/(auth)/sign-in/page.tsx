import type { Metadata } from "next"

import { SignInForm } from "@/components/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your SalonBook account.",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-muted/30 px-4 py-10 sm:px-6">
      <SignInForm />
    </div>
  )
}
