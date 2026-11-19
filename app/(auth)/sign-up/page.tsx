import type { Metadata } from "next"

import { SignUpForm } from "@/components/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your SalonBook account.",
}

export default function SignUpPage() {
  
  return (
    <div className="bg-muted/30 flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-10 sm:px-6">
      <SignUpForm />
    </div>
  )
}
