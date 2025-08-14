"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface HydrationSafeImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  [key: string]: any
}

export function HydrationSafeImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  ...props
}: HydrationSafeImageProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div
        className={className}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'transparent',
          display: 'inline-block'
        }}
        suppressHydrationWarning
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      suppressHydrationWarning
      {...props}
    />
  )
} 