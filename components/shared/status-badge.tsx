'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default'

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300',
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(variantStyles[variant], className)}
    >
      {status}
    </Badge>
  )
}

// Pre-configured status badges for common use cases

export function StockStatusBadge({ quantity, minStock }: { quantity: number; minStock: number }) {
  if (quantity <= 0) {
    return <StatusBadge status="Sin stock" variant="error" />
  }
  if (quantity <= minStock) {
    return <StatusBadge status="Stock bajo" variant="warning" />
  }
  return <StatusBadge status="En stock" variant="success" />
}

export function SaleStatusBadge({ status }: { status: 'pending' | 'completed' | 'cancelled' | 'refunded' }) {
  const statusMap: Record<typeof status, { label: string; variant: StatusVariant }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    completed: { label: 'Completada', variant: 'success' },
    cancelled: { label: 'Cancelada', variant: 'error' },
    refunded: { label: 'Reembolsada', variant: 'info' },
  }
  const { label, variant } = statusMap[status]
  return <StatusBadge status={label} variant={variant} />
}

export function PaymentStatusBadge({ status }: { status: 'pending' | 'partial' | 'paid' | 'refunded' }) {
  const statusMap: Record<typeof status, { label: string; variant: StatusVariant }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    partial: { label: 'Parcial', variant: 'info' },
    paid: { label: 'Pagado', variant: 'success' },
    refunded: { label: 'Reembolsado', variant: 'error' },
  }
  const { label, variant } = statusMap[status]
  return <StatusBadge status={label} variant={variant} />
}

export function PurchaseStatusBadge({ status }: { status: 'pending' | 'received' | 'partial' | 'cancelled' }) {
  const statusMap: Record<typeof status, { label: string; variant: StatusVariant }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    received: { label: 'Recibida', variant: 'success' },
    partial: { label: 'Parcial', variant: 'info' },
    cancelled: { label: 'Cancelada', variant: 'error' },
  }
  const { label, variant } = statusMap[status]
  return <StatusBadge status={label} variant={variant} />
}

export function CustomerTypeBadge({ type }: { type: 'retail' | 'wholesale' | 'vip' }) {
  const typeMap: Record<typeof type, { label: string; variant: StatusVariant }> = {
    retail: { label: 'Minorista', variant: 'default' },
    wholesale: { label: 'Mayorista', variant: 'info' },
    vip: { label: 'VIP', variant: 'success' },
  }
  const { label, variant } = typeMap[type]
  return <StatusBadge status={label} variant={variant} />
}
