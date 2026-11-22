"use client"

/* eslint-disable @next/next/no-img-element */

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  ImageIcon,
  Loader2Icon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { saveService } from "@/lib/service-actions"
import type { Service, ServiceInput, ServiceStatus } from "@/lib/service-types"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MANAGE_SERVICES_PATH = "/dashboard/admin/manage-services"

const statusItems = {
  active: "Active",
  inactive: "Inactive",
}

type FormValues = {
  name: string
  category: string
  description: string
  price: string
  duration: string
  image: string
  status: ServiceStatus
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type Feedback = {
  type: "success" | "error"
  message: string
}

function getInitialValues(service?: Service): FormValues {
  return {
    name: service?.name ?? "",
    category: service?.category ?? "",
    description: service?.description ?? "",
    price: service ? String(service.price) : "",
    duration: service ? String(service.duration) : "",
    image: service?.image ?? "",
    status: service?.status ?? "active",
  }
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  const price = Number(values.price)
  const duration = Number(values.duration)

  if (!values.name.trim()) {
    errors.name = "Service name is required."
  }

  if (!values.category.trim()) {
    errors.category = "Service category is required."
  }

  if (!values.price.trim() || !Number.isFinite(price) || price <= 0) {
    errors.price = "Price must be a positive number."
  }

  if (!values.duration.trim() || !Number.isFinite(duration) || duration <= 0) {
    errors.duration = "Duration must be a positive number."
  }

  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  )
}

export function ServiceForm({ service }: { service?: Service | null }) {
  const router = useRouter()
  const isEditing = Boolean(service)

  const [values, setValues] = React.useState<FormValues>(() =>
    getInitialValues(service ?? undefined)
  )
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => {
      if (!previous[key]) return previous

      const next = { ...previous }
      delete next[key]
      return next
    })
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      event.target.value = ""
      setErrors((previous) => ({
        ...previous,
        image: "Please choose an image file.",
      }))
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = ""
      setErrors((previous) => ({
        ...previous,
        image: "The image must be 5 MB or smaller.",
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => update("image", String(reader.result))
    reader.onerror = () =>
      setErrors((previous) => ({
        ...previous,
        image: "Could not read the image. Please try another file.",
      }))
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setFeedback(null)

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({
        type: "error",
        message: "Please fix the highlighted fields and try again.",
      })
      return
    }

    setIsSubmitting(true)

    const input: ServiceInput = {
      name: values.name.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      duration: Number(values.duration),
      image: values.image,
      status: values.status,
    }

    try {
      const result = await saveService(service?.id ?? null, input)

      if (!result.ok) {
        setFeedback({ type: "error", message: result.error })
        setIsSubmitting(false)
        return
      }

      setFeedback({
        type: "success",
        message: isEditing ? "Service updated." : "Service added.",
      })
      router.push(MANAGE_SERVICES_PATH)
      router.refresh()
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

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="font-heading text-xl">
          {isEditing ? "Update Service" : "Add Service"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details for this salon service."
            : "Add a new service to your salon menu."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {feedback && (
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
            >
              {feedback.type === "error" ? (
                <CircleAlertIcon />
              ) : (
                <CircleCheckIcon className="text-emerald-600 dark:text-emerald-400" />
              )}
              <AlertTitle>
                {feedback.type === "error" ? "Could not save service" : "Saved"}
              </AlertTitle>
              <AlertDescription className="text-current opacity-90">
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                name="name"
                placeholder="e.g. Classic Haircut"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "service-name-error" : undefined
                }
              />
              <FieldError id="service-name-error" message={errors.name} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="service-category">Service Category</Label>

              <Select
  value={values.category}
  onValueChange={(value) => {
    if (value) update("category", value)
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="haircut">Haircut & Styling</SelectItem>
    <SelectItem value="hair-color">Hair Coloring</SelectItem>
    <SelectItem value="hair-treatment">Hair Treatment</SelectItem>
    <SelectItem value="facial-skincare">Facial & Skincare</SelectItem>
    <SelectItem value="makeup">Makeup</SelectItem>
    <SelectItem value="manicure-pedicure">Manicure & Pedicure</SelectItem>
    <SelectItem value="spa-massage">Spa & Massage</SelectItem>
  </SelectContent>
</Select>


              <FieldError
                id="service-category-error"
                message={errors.category}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              name="description"
              placeholder="Describe what this service includes."
              rows={4}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Optional, but helpful for customers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="service-price">Price</Label>
              <Input
                id="service-price"
                name="price"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="25.00"
                value={values.price}
                onChange={(event) => update("price", event.target.value)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={
                  errors.price ? "service-price-error" : undefined
                }
              />
              <FieldError id="service-price-error" message={errors.price} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="service-duration">
                Estimated Duration (minutes)
              </Label>
              <Input
                id="service-duration"
                name="duration"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="30"
                value={values.duration}
                onChange={(event) => update("duration", event.target.value)}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={
                  errors.duration ? "service-duration-error" : undefined
                }
              />
              <FieldError
                id="service-duration-error"
                message={errors.duration}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service-image">Service Image</Label>
            {values.image ? (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={values.image}
                  alt="Service preview"
                  className="h-44 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground">
                <ImageIcon className="size-5" />
                <p className="text-sm">No image selected</p>
              </div>
            )}
            <Input
              id="service-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-invalid={Boolean(errors.image)}
              aria-describedby={
                errors.image ? "service-image-error" : "service-image-hint"
              }
            />
            <p
              id="service-image-hint"
              className="text-xs text-muted-foreground"
            >
              Upload a PNG, JPG or WebP image up to 5 MB.
            </p>
            <FieldError id="service-image-error" message={errors.image} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service-status">Service Status</Label>
            <Select
              items={statusItems}
              value={values.status}
              onValueChange={(value) => {
                if (value) update("status", value as ServiceStatus)
              }}
            >
              <SelectTrigger id="service-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Active services are available to customers.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              render={<Link href={MANAGE_SERVICES_PATH} />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Saving…
                </>
              ) : isEditing ? (
                "Update Service"
              ) : (
                "Add Service"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
