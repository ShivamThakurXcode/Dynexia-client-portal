import type React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  children: React.ReactNode
  className?: string
}

export function Heading({ as: Component = "h2", size = "lg", children, className, ...props }: HeadingProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  }

  return (
    <Component className={cn("font-bold tracking-tight", sizeClasses[size], className)} {...props}>
      {children}
    </Component>
  )
}
