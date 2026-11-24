"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, ScissorsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"



export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  const { data: session, isPending } = authClient.useSession()
  // console.log("user session in navbar", session);

  const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-services", label: "Browse Services" },
  { href: `/dashboard/${session?.user?.role || 'customer'}` , label: "Dashboard" },
]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ScissorsIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base">SalonBook</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  active={isActive(link.href)}
                  className="px-3 py-2"
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          {!isPending && !session?.user && (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>

              <Button nativeButton={false} render={<Link href="/sign-up" />}>
                Sign Up
              </Button>
            </>
          )}

          {session?.user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium"> Welcome, {session.user.name}</span>

              <Button
                variant="outline"
                onClick={async () => {
                  await authClient.signOut()
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
          {/* Sign In - Responsive */}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <ScissorsIcon className="size-3.5" aria-hidden="true" />
                  </span>
                  SalonBook
                </SheetTitle>

                <SheetDescription className="sr-only">
                  Site navigation
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
