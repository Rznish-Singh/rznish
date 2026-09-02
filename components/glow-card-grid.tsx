"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type GlowCardGridProps =
  React.ComponentPropsWithoutRef<"div"> & {
    cardRadius?: number

    // Mouse glow
    glowColor?: string
    glowOpacity?: number
    glowBlur?: number
    glowSize?: number

    // Icon glow
    iconBlur?: number
    iconSaturate?: number
    iconBrightness?: number
    iconScale?: number
    iconOpacity?: number

    // Border
    borderWidth?: number
    borderBlur?: number
    borderSaturate?: number
    borderBrightness?: number
    borderContrast?: number

    children: ReactNode
  }

export function GlowCardGrid({
  cardRadius = 16,

  // Mouse glow
  glowColor = "#6366f1",
  glowOpacity = 0.45,
  glowBlur = 45,
  glowSize = 140,

  // Icon glow
  iconBlur = 25,
  iconSaturate = 5,
  iconBrightness = 1.3,
  iconScale = 3,
  iconOpacity = 0.18,

  // Border
  borderWidth = 2,
  borderBlur = 10,
  borderSaturate = 4.2,
  borderBrightness = 2.5,
  borderContrast = 2.5,

  className,
  style,
  ...props
}: GlowCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!gridRef.current) return

      const cards =
        gridRef.current.querySelectorAll<HTMLElement>(
          "[data-slot='glow-card']"
        )

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()

        // Pointer position inside the card
        const x =
          ((event.clientX - rect.left) / rect.width) * 100

        const y =
          ((event.clientY - rect.top) / rect.height) * 100

        card.style.setProperty(
          "--pointer-x",
          `${x}%`
        )

        card.style.setProperty(
          "--pointer-y",
          `${y}%`
        )
      })
    }

    document.addEventListener(
      "pointermove",
      handlePointerMove
    )

    return () => {
      document.removeEventListener(
        "pointermove",
        handlePointerMove
      )
    }
  }, [])

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid w-full grid-cols-1 gap-4",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        className
      )}
      style={
        {
          // Card
          "--card-radius": `${cardRadius}px`,

          // Mouse glow
          "--card-glow-color": glowColor,
          "--card-glow-opacity": glowOpacity,
          "--card-glow-blur": `${glowBlur}px`,
          "--card-glow-size": `${glowSize}px`,

          // Icon glow
          "--card-icon-blur": `${iconBlur}px`,
          "--card-icon-saturate": iconSaturate,
          "--card-icon-brightness": iconBrightness,
          "--card-icon-scale": iconScale,
          "--card-icon-opacity": iconOpacity,

          // Border
          "--card-border-width": `${borderWidth}px`,
          "--card-border-blur": `${borderBlur}px`,
          "--card-border-saturate": borderSaturate,
          "--card-border-brightness": borderBrightness,
          "--card-border-contrast": borderContrast,

          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export type GlowFeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
  href?: string
  external?: boolean
  className?: string
}

export function GlowFeatureCard({
  icon,
  title,
  description,
  href,
  external = false,
  className,
}: GlowFeatureCardProps) {
  const content = (
    <Card
      data-slot="glow-card"
      className={cn(
        "group relative min-h-[160px]",
        "overflow-hidden",
        "rounded-[var(--card-radius)]",
        "transition-[transform,border-color]",
        "duration-200",
        "select-none",
        "hover:border-foreground/20",
        "active:scale-[0.98]",
        className
      )}
    >
      {/* =====================================================
          MOUSE GLOW
          ===================================================== */}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-0",
          "rounded-full",
          "transition-opacity duration-200",
          "opacity-0 group-hover:opacity-100",
          "will-change-[left,top,filter]"
        )}
        style={{
          width: "var(--card-glow-size)",
          height: "var(--card-glow-size)",

          left: "var(--pointer-x, 50%)",
          top: "var(--pointer-y, 50%)",

          transform:
            "translate(-50%, -50%)",

          background:
            "var(--card-glow-color)",

          opacity:
            undefined,

          filter:
            "blur(var(--card-glow-blur))",

          // CSS custom property is controlled by the grid
          // and the hover state is controlled by Tailwind.
        }}
      />

      {/* =====================================================
          SOFT RADIAL GLOW
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), var(--card-glow-color) 0%, transparent 45%)",
        }}
      />

      {/* =====================================================
          ICON BACKGROUND GLOW
          ===================================================== */}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "z-0 flex items-center justify-center",
          "translate-z-0",
          "scale-[var(--card-icon-scale)]",
          "blur-[var(--card-icon-blur)]",
          "brightness-[var(--card-icon-brightness)]",
          "saturate-[var(--card-icon-saturate)]",
          "opacity-[var(--card-icon-opacity)]",
          "will-change-transform"
        )}
      >
        {icon}
      </div>

      {/* =====================================================
          CARD CONTENT
          ===================================================== */}

      <CardHeader
        className={cn(
          "relative z-10",
          "min-h-[152px]",
          "justify-center"
        )}
      >
        {/* Icon */}
        <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        {/* Title */}
        <CardTitle>
          {title}
        </CardTitle>

        {/* Description */}
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      {/* =====================================================
          GLOW BORDER
          ===================================================== */}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-20",
          "rounded-[var(--card-radius)]",
          "border-[var(--card-border-width)]",
          "border-solid",
          "border-transparent",
          "backdrop-blur-[var(--card-border-blur)]",
          "backdrop-brightness-[var(--card-border-brightness)]",
          "backdrop-contrast-[var(--card-border-contrast)]",
          "backdrop-saturate-[var(--card-border-saturate)]",
          "[clip-path:inset(0_round_var(--card-radius))]"
        )}
        style={
          {
            maskImage:
              "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
            maskOrigin:
              "border-box, padding-box",
            maskClip:
              "border-box, padding-box",
            maskComposite:
              "exclude",
            WebkitMaskComposite:
              "xor",
          } as React.CSSProperties
        }
      />
    </Card>
  )

  // No link
  if (!href) {
    return content
  }

  // External link
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    )
  }

  // Normal link
  return (
    <a
      href={href}
      className="block"
    >
      {content}
    </a>
  )
}