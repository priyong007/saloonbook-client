"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Change this to send newly registered users somewhere else (e.g. "/dashboard").
const REDIRECT_AFTER_SIGN_UP = "/"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ImageMode = "upload" | "url"
type Feedback = {
  type: "success" | "error" | "info"
  message: string
}

export type SignUpFormValues = {
  fullName: string
  email: string
  password: string
  imageMode: ImageMode
  profileImage: File | string | null
}

function getPasswordRules(password: string) {
  return [
    {
      id: "length",
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ]
}

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function SignUpForm() {
  const router = useRouter()

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const [imageMode, setImageMode] = React.useState<ImageMode>("upload")
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imageUrl, setImageUrl] = React.useState("")

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const passwordRules = getPasswordRules(password)
  const passwordIsValid = passwordRules.every((rule) => rule.valid)

  const filePreview = React.useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  )

  React.useEffect(() => {
    if (!filePreview) return
    return () => URL.revokeObjectURL(filePreview)
  }, [filePreview])

  const previewSrc = imageMode === "upload" ? filePreview : imageUrl.trim()

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

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name."
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Please enter a password."
    } else if (!passwordIsValid) {
      nextErrors.password = "Your password must meet all the requirements."
    }

    if (
      imageMode === "url" &&
      imageUrl.trim() &&
      !isValidImageUrl(imageUrl.trim())
    ) {
      nextErrors.imageUrl = "Enter a valid image URL."
    }

    return nextErrors
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      setImageFile(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      setImageFile(null)
      event.target.value = ""
      setErrors((previous) => ({
        ...previous,
        image: "Please choose an image file.",
      }))
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageFile(null)
      event.target.value = ""
      setErrors((previous) => ({
        ...previous,
        image: "The image must be 5 MB or smaller.",
      }))
      return
    }

    setImageFile(file)
    clearError("image")
  }

  function handleGoogleSignUp() {
    // TODO: replace with your provider, e.g. authClient.signIn.social({ provider: "google" })
    console.log("Google sign-up clicked")
    setFeedback({
      type: "info",
      message:
        "Google authentication isn't connected yet. Hook it up when your auth provider is ready.",
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
        document.getElementById(`signup-${firstInvalidField}`)?.focus()
      )
      return
    }

    setIsSubmitting(true)

    const values: SignUpFormValues = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      imageMode,
      profileImage:
        imageMode === "upload" ? imageFile : imageUrl.trim() || null,
    }

    // TODO: send `values` to your auth provider, e.g.
    // await authClient.signUp.email({ name: values.fullName, email: values.email, password: values.password, image: ... })
    console.log("Sign-up form data:", values)

    try {
      // Simulates the registration request so the success state and redirect
      // can be tested before the real backend is wired up.
      await new Promise((resolve) => setTimeout(resolve, 900))

      setFeedback({
        type: "success",
        message: "Your account has been created. Redirecting…",
      })
      window.setTimeout(() => router.replace(REDIRECT_AFTER_SIGN_UP), 1200)
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
          Create your account
        </h1>
        <CardDescription>
          Join SalonBook and book your next appointment in seconds.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleSignUp}
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
              or sign up with email
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
                  ? "Registration successful"
                  : feedback.type === "error"
                    ? "Couldn't create your account"
                    : "Google sign-up"}
              </AlertTitle>
              <AlertDescription className="text-current opacity-90">
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-fullName">Full Name</Label>
            <Input
              id="signup-fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                clearError("fullName")
              }}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "signup-fullName-error" : undefined
              }
            />
            {errors.fullName && (
              <p
                id="signup-fullName-error"
                className="text-xs text-destructive"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
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
              aria-describedby={errors.email ? "signup-email-error" : undefined}
            />
            {errors.email && (
              <p id="signup-email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                className="pr-9"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  clearError("password")
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={[
                  "signup-password-rules",
                  errors.password ? "signup-password-error" : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
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

            <ul id="signup-password-rules" className="space-y-1">
              {passwordRules.map((rule) => (
                <li
                  key={rule.id}
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    rule.valid
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {rule.valid ? (
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    <CircleIcon className="size-3.5" aria-hidden="true" />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>

            {errors.password && (
              <p
                id="signup-password-error"
                className="text-xs text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm leading-none font-medium">
                Profile Image{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <Avatar size="lg" className="size-10">
                {previewSrc ? (
                  <AvatarImage src={previewSrc} alt="Profile image preview" />
                ) : null}
                <AvatarFallback>
                  <ImageIcon className="size-4" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
            </div>

            <Tabs
              value={imageMode}
              onValueChange={(value) => {
                setImageMode(value as ImageMode)
                clearError("image")
                clearError("imageUrl")
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1">
                  Upload Image
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1">
                  Image URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" keepMounted>
                <Label htmlFor="signup-image" className="sr-only">
                  Upload profile image
                </Label>
                <Input
                  id="signup-image"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby={
                    errors.image ? "signup-image-error" : undefined
                  }
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  PNG, JPG or WebP, up to 5 MB.
                </p>
                {errors.image && (
                  <p
                    id="signup-image-error"
                    className="mt-1 text-xs text-destructive"
                  >
                    {errors.image}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="url" keepMounted>
                <Label htmlFor="signup-imageUrl" className="sr-only">
                  Profile image URL
                </Label>
                <Input
                  id="signup-imageUrl"
                  name="profileImageUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrl}
                  onChange={(event) => {
                    setImageUrl(event.target.value)
                    clearError("imageUrl")
                  }}
                  aria-invalid={Boolean(errors.imageUrl)}
                  aria-describedby={
                    errors.imageUrl ? "signup-imageUrl-error" : undefined
                  }
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Paste a direct link to an image.
                </p>
                {errors.imageUrl && (
                  <p
                    id="signup-imageUrl-error"
                    className="mt-1 text-xs text-destructive"
                  >
                    {errors.imageUrl}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
