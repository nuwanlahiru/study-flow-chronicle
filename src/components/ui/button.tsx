import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-studypurple-500 to-blue-500 hover:from-studypurple-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg",
        outline:
          "border border-studypurple-200 bg-white/70 backdrop-blur-sm text-studypurple-600 hover:bg-studypurple-50 hover:border-studypurple-300 hover:text-studypurple-700",
        secondary:
          "bg-white/70 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/90 hover:text-studypurple-600 shadow-sm hover:shadow-md",
        ghost: "hover:bg-white/50 backdrop-blur-sm hover:text-studypurple-600 transition-all",
        link: "text-studypurple-500 hover:text-studypurple-600 underline-offset-4 hover:underline",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-md hover:shadow-lg transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
