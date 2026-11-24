import { ObjectId, type WithId } from "mongodb"

import { db } from "@/lib/db"
import type { Service, ServiceInput, ServiceStatus } from "@/lib/service-types"

type ServiceDocument = {
  name: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
  createdAt?: Date
  updatedAt?: Date
}

const services = db.collection<ServiceDocument>("services")

function toService(document: WithId<ServiceDocument>): Service {
  return {
    _id: document._id.toString(),
    name: document.name,
    category: document.category,
    description: document.description,
    price: document.price,
    duration: document.duration,
    image: document.image,
    status: document.status,
    createdAt: document.createdAt?.toISOString(),
    updatedAt: document.updatedAt?.toISOString(),
  }
}

export async function getServices(): Promise<Service[]> {
  const documents = await services.find().sort({ createdAt: -1 }).toArray()
  return documents.map(toService)
}

export async function getActiveServices(): Promise<Service[]> {
  const documents = await services
    .find({ status: "active" })
    .sort({ createdAt: -1, _id: -1 })
    .toArray()

  return documents.map(toService)
}

export async function getServiceById(id: string): Promise<Service | null> {
  if (!ObjectId.isValid(id)) return null

  const document = await services.findOne({ _id: new ObjectId(id) })
  return document ? toService(document) : null
}

export async function createService(input: ServiceInput): Promise<string> {
  const now = new Date()
  const result = await services.insertOne({
    ...input,
    createdAt: now,
    updatedAt: now,
  })

  return result.insertedId.toString()
}

export async function updateService(
  id: string,
  input: ServiceInput
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false

  const result = await services.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } }
  )

  return result.matchedCount > 0
}

export async function deleteService(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false

  const result = await services.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
