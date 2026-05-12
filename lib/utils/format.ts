// =============================================================================
// UTILIDADES DE FORMATO
// =============================================================================

import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// -----------------------------------------------------------------------------
// MONEDA
// -----------------------------------------------------------------------------

export function formatCurrency(
  amount: number,
  currency: string = 'ARS',
  symbol: string = '$'
): string {
  // Formatear con separadores de miles y 2 decimales
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
  
  return `${symbol}${formatted}`
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

// -----------------------------------------------------------------------------
// NÚMEROS
// -----------------------------------------------------------------------------

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// -----------------------------------------------------------------------------
// FECHAS
// -----------------------------------------------------------------------------

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd/MM/yyyy', { locale: es })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "dd/MM/yyyy 'a las' HH:mm", { locale: es })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm', { locale: es })
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(d)) {
    return `Hoy a las ${format(d, 'HH:mm')}`
  }
  
  if (isYesterday(d)) {
    return `Ayer a las ${format(d, 'HH:mm')}`
  }
  
  return format(d, "d 'de' MMMM", { locale: es })
}

export function formatTimeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

// -----------------------------------------------------------------------------
// TEXTO
// -----------------------------------------------------------------------------

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

// -----------------------------------------------------------------------------
// SKU / CÓDIGOS
// -----------------------------------------------------------------------------

export function generateSKU(category: string, index: number): string {
  const prefix = category.slice(0, 3).toUpperCase()
  return `${prefix}-${String(index).padStart(3, '0')}`
}

export function generateSaleNumber(index: number): string {
  const year = new Date().getFullYear()
  return `V-${year}-${String(index).padStart(4, '0')}`
}

export function generatePurchaseNumber(index: number): string {
  const year = new Date().getFullYear()
  return `OC-${year}-${String(index).padStart(4, '0')}`
}

export function generateCustomerCode(index: number): string {
  return `CLI-${String(index).padStart(3, '0')}`
}

// -----------------------------------------------------------------------------
// STOCK
// -----------------------------------------------------------------------------

export function getStockStatus(current: number, min: number): 'ok' | 'low' | 'out' {
  if (current <= 0) return 'out'
  if (current <= min) return 'low'
  return 'ok'
}

export function getStockStatusLabel(status: 'ok' | 'low' | 'out'): string {
  const labels = {
    ok: 'En stock',
    low: 'Stock bajo',
    out: 'Sin stock',
  }
  return labels[status]
}

export function getStockStatusColor(status: 'ok' | 'low' | 'out'): string {
  const colors = {
    ok: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    low: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    out: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status]
}
