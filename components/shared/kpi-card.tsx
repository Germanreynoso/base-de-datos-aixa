'use client'

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  loading?: boolean
  className?: string
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  className,
}: KPICardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = trend?.value 
    ? trend.value > 0 
      ? TrendingUp 
      : TrendingDown
    : Minus

  const trendColor = trend?.value
    ? trend.value > 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'
    : 'text-muted-foreground'

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="size-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {trend && (
              <>
                <TrendIcon className={cn('size-3', trendColor)} />
                <span className={trendColor}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </>
            )}
            {description && (
              <span className="text-muted-foreground">
                {trend && ' '}{description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface KPIGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function KPIGrid({ children, columns = 4, className }: KPIGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}
