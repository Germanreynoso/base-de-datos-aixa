'use client'

import { useQuery } from '@tanstack/react-query'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { PageHeader } from '@/components/shared/page-header'
import { KPICard, KPIGrid } from '@/components/shared/kpi-card'
import { ChartCard } from '@/components/shared/chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getDashboardStats,
  getSalesChartData,
  getSalesByCategoryData,
  getTopProductsData,
  getLowStockProducts,
  getSales,
} from '@/lib/services'
import { formatCurrency, formatCurrencyCompact, formatRelativeDate } from '@/lib/utils/format'
import { StockStatusBadge, SaleStatusBadge } from '@/components/shared/status-badge'

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#8b5cf6', '#ec4899', '#14b8a6']

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  const { data: salesChart, isLoading: chartLoading } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: () => getSalesChartData(7),
  })

  const { data: categoryData } = useQuery({
    queryKey: ['sales-by-category'],
    queryFn: getSalesByCategoryData,
  })

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => getTopProductsData(5),
  })

  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: getLowStockProducts,
  })

  const { data: recentSales } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => getSales({ pageSize: 5 }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general de tu negocio"
        actions={
          <Button asChild>
            <Link href="/pos">Nueva Venta</Link>
          </Button>
        }
      />

      {/* KPIs */}
      <KPIGrid>
        <KPICard
          title="Ventas de Hoy"
          value={stats ? formatCurrency(stats.todaySales) : '-'}
          icon={DollarSign}
          trend={stats ? { value: stats.salesGrowth, label: 'vs ayer' } : undefined}
          loading={statsLoading}
        />
        <KPICard
          title="Transacciones"
          value={stats?.todayTransactions.toString() ?? '-'}
          icon={ShoppingCart}
          description="ventas hoy"
          loading={statsLoading}
        />
        <KPICard
          title="Ticket Promedio"
          value={stats ? formatCurrency(stats.todayAvgTicket) : '-'}
          icon={TrendingUp}
          loading={statsLoading}
        />
        <KPICard
          title="Ventas del Mes"
          value={stats ? formatCurrencyCompact(stats.monthSales) : '-'}
          icon={Wallet}
          description={stats ? `Semana: ${formatCurrencyCompact(stats.weekSales)}` : undefined}
          loading={statsLoading}
        />
      </KPIGrid>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        <ChartCard
          title="Ventas de la Semana"
          description="Evolución de ventas diarias"
          loading={chartLoading}
          className="lg:col-span-4"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('es', { weekday: 'short' })
                  }}
                  className="text-xs"
                />
                <YAxis
                  tickFormatter={(value) => formatCurrencyCompact(value)}
                  className="text-xs"
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Ventas']}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString('es', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'short' 
                    })
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Ventas por Categoría"
          description="Distribución del período"
          className="lg:col-span-3"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="total"
                  nameKey="category"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                  labelLine={false}
                >
                  {categoryData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Productos Más Vendidos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reportes/productos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts?.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.quantity} vendidos
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(product.total)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <CardTitle className="text-base font-medium">Alertas de Stock</CardTitle>
            </div>
            <Badge variant="secondary">{lowStockProducts?.length ?? 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts?.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {product.stock_quantity} / Mín: {product.min_stock}
                    </p>
                  </div>
                  <StockStatusBadge
                    quantity={product.stock_quantity}
                    minStock={product.min_stock}
                  />
                </div>
              ))}
              {(!lowStockProducts || lowStockProducts.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No hay productos con stock bajo
                </p>
              )}
            </div>
            {lowStockProducts && lowStockProducts.length > 0 && (
              <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                <Link href="/inventario">Ver Inventario</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Ventas Recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ventas">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales?.data.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.sale_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.customer?.name ?? 'Consumidor Final'} - {formatRelativeDate(sale.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium">{formatCurrency(sale.total)}</span>
                    <SaleStatusBadge status={sale.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
