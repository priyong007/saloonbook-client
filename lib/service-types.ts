export type ServiceStatus = "active" | "inactive"

export type Service = {
  _id: string
  id?: number
  name: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
  createdAt?: string
  updatedAt?: string
}

export type ServiceInput = {
  name: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
}

export const SERVICE_CATEGORIES = [
  { value: "haircut", label: "Haircut & Styling" },
  { value: "hair-color", label: "Hair Coloring" },
  { value: "hair-treatment", label: "Hair Treatment" },
  { value: "facial-skincare", label: "Facial & Skincare" },
  { value: "makeup", label: "Makeup" },
  { value: "manicure-pedicure", label: "Manicure & Pedicure" },
  { value: "spa-massage", label: "Spa & Massage" },
] as const

export function getServiceCategoryLabel(value: string) {
  return SERVICE_CATEGORIES.find((category) => category.value === value)?.label ?? value
}
