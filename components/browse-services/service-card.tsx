import Image from "next/image"
import { Clock3Icon, TagIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getServiceCategoryLabel, type Service } from "@/lib/service-types"
import { redirect } from "next/navigation"

type ServiceCardProps = {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {

  const handleViewDetails = () => {
    redirect(`/browse-services/${service._id}`)
  }
  return (
    <Card className="h-full pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit">
          {getServiceCategoryLabel(service.category)}
        </Badge>
        <CardTitle className="line-clamp-1">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {service.description || "No description available."}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <TagIcon className="size-4 text-muted-foreground" />$
          {service.price.toFixed(2)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Clock3Icon className="size-4" />
          {service.duration} min
        </span>
      </CardContent>

      <CardFooter>
        
        <Button onClick={handleViewDetails} type="button" variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
