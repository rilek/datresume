import { ComponentProps } from 'react'
import clsx from 'clsx'
import { cva, VariantProps } from 'class-variance-authority'

const buttonClasses = cva(
  "cursor-pointer font-medium rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sky-200 hover:bg-sky-400 disabled:bg-gray-400 text-sky-950",
        secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900",
        success: "bg-green-200 hover:bg-green-300 disabled:bg-green-100 text-green-900",
      },
      size: {
        default: "py-2 px-4",
        icon: "p-2 [&>svg]:w-4 [&>svg]:h-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export const Button = ({ variant, size, className, ...props }: ComponentProps<"button"> & VariantProps<typeof buttonClasses>) =>
  <button {...props} className={clsx(buttonClasses({ variant, size, className }))} />