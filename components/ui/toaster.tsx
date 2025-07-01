"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps as RadixToastProps,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

type ToastProps = RadixToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export function Toaster() {
  const { toasts } = useToast() as { toasts: ToastProps[] }

  return (
    <ToastProvider>
      {toasts.map((toast: ToastProps) => {
        const { id, title, description, action, ...props } = toast
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}