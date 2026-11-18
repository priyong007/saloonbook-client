import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HomeBanner() {
  return (
    <section
      aria-labelledby="home-banner-heading"
      className="relative isolate flex min-h-[34rem] items-center overflow-hidden bg-neutral-900 sm:min-h-[36rem] lg:min-h-[40rem]"
    >
      <Image
        src="/images/salon-hero.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <h1
            id="home-banner-heading"
            className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
          >
            Great hair days start here.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-white/80 sm:text-lg">
            Discover top-rated salons and barbers near you. Compare services and
            prices, then book your next appointment in seconds.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            className="mt-8 h-11 w-full gap-2 bg-white px-6 text-base text-neutral-950 hover:bg-white/90 sm:w-auto"
            render={<Link href="/services" />}
          >
            Explore Salon Services
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
