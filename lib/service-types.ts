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
