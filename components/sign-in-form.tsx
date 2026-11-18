"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { GoogleIcon } from "@/components/google-icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Change this to send signed-in users somewhere else (e.g. "/dashboard").
const REDIRECT_AFTER_SIGN_IN = "/"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Feedback = {
  type: "success" | "error" | "info"
  message: string
}

export type SignInFormValues = {
  email: string
  password: string
}

export function SignInForm() {
  const router = useRouter()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function clearError(key: string) {
    setErrors((previous) => {
      if (!previous[key]) return previous
      const next = { ...previous }
      delete next[key]
      return next
    })
  }

  function validate() {
    const nextErrors: Record<string, string> = {}

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Please enter your password."
    }

    return nextErrors
  }

  function handleGoogleSignIn() {
    // TODO: replace with your provider, e.g. authClient.signIn.social({ provider: "google" })
    console.log("Google sign-in clicked")
    setFeedback({
      type: "info",
      message:
        "Google sign-in isn't connected yet. Hook it up when your auth provider is ready.",
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setFeedback(null)
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({
        type: "error",
        message: "Please fix the highlighted fields and try again.",
      })
      const firstInvalidField = Object.keys(nextErrors)[0]
      requestAnimationFrame(() =>
        document.getElementById(`signin-${firstInvalidField}`)?.focus()
      )
      return
    }

    setIsSubmitting(true)

    const values: SignInFormValues = {
      email: email.trim().toLowerCase(),
      password,
    }

    // TODO: replace with your auth provider, e.g.
    // await authClient.signIn.email({ email: values.email, password: values.password })
    console.log("Sign-in form data:", values)

    try {
      // Simulates the login request so the success state and redirect can be
      // tested before the real backend is wired up.
      await new Promise((resolve) => setTimeout(resolve, 900))

      setFeedback({
        type: "success",
        message: "You're signed in. Redirecting…",
      })
      window.setTimeout(() => router.replace(REDIRECT_AFTER_SIGN_IN), 1200)
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  const feedbackIcon =
    feedback?.type === "success" ? (
      <CircleCheckIcon />
    ) : feedback?.type === "error" ? (
      <CircleAlertIcon />
    ) : (
      <InfoIcon />
    )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="font-heading text-xl leading-snug font-medium">
          Welcome back
        </h1>
        <CardDescription>
          Sign in to book and manage your appointments.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>

        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
              or sign in with email
            </span>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {feedback && (
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
              className={cn(
                feedback.type === "success" &&
                  "border-emerald-600/30 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400",
                feedback.type === "info" &&
                  "border-sky-600/30 text-sky-700 dark:border-sky-500/40 dark:text-sky-400"
              )}
            >
              {feedbackIcon}
              <AlertTitle>
                {feedback.type === "success"
                  ? "Signed in successfully"
                  : feedback.type === "error"
                    ? "Couldn't sign you in"
                    : "Google sign-in"}
              </AlertTitle>
              <AlertDescription className="text-current opacity-90">
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
            />
            {errors.email && (
              <p id="signin-email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signin-password">Password</Label>
            <div className="relative">
              <Input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pr-9"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  clearError("password")
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "signin-password-error" : undefined
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-0.5 right-0.5"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errors.password && (
              <p
                id="signin-password-error"
                className="text-xs text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
