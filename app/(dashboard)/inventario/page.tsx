'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Package, AlertTriangle, PackageCheck, PackageX } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KPICard, KPIGrid } from '@/components/shared/kpi-card'
import { DataTable, SortableHeader } from '@/components/shared/data-table'
import { StockStatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getProducts, getCategories } from '@/lib/services'
import { formatCurrency } from '@/lib/utils/format'
import type { Product } from '@/lib/types'
import { AdjustStockForm } from './adjust-stock-form'

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue('sku')}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column}>Producto</SortableHeader>,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="space-y-1">
          <p className="font-medium leading-none">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.category?.name ?? 'Sin categoría'}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'stock_quantity',
    header: ({ column }) => <SortableHeader column={column}>Stock</SortableHeader>,
    cell: ({ row }) => {
      const product = row.original
      const percentage = product.max_stock 
        ? (product.stock_quantity / product.max_stock) * 100
        : (product.stock_quantity / (product.min_stock * 5)) * 100
      
      return (
        <div className="w-32 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{product.stock_quantity}</span>
            <span className="text-xs text-muted-foreground">
              mín: {product.min_stock}
            </span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const product = row.original
      return (
        <StockStatusBadge
          quantity={product.stock_quantity}
          minStock={product.min_stock}
        />
      )
    },
  },
  {
    accessorKey: 'cost_price',
    header: ({ column }) => <SortableHeader column={column}>Costo Unit.</SortableHeader>,
    cell: ({ row }) => formatCurrency(row.getValue('cost_price')),
  },
  {
    id: 'value',
    header: ({ column }) => <SortableHeader column={column}>Valor Stock</SortableHeader>,
    cell: ({ row }) => {
      const product = row.original
      return (
        <span className="font-medium">
          {formatCurrency(product.stock_quantity * product.cost_price)}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Ajustar Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajustar Stock</DialogTitle>
              <DialogDescription>
                {product.name} - Stock actual: {product.stock_quantity}
              </DialogDescription>
            </DialogHeader>
            <AdjustStockForm product={product} />
          </DialogContent>
        </Dialog>
      )
    },
  },
]

export default function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['inventory', categoryFilter, stockFilter],
    queryFn: () => getProducts({
      category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
      low_stock: stockFilter === 'low' ? true : undefined,
      pageSize: 100,
    }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const products = productsData?.data ?? []
  
  // Calculate stats
  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock && p.stock_quantity > 0).length
  const outOfStockCount = products.filter(p => p.stock_quantity <= 0).length
  const totalValue = products.reduce((sum, p) => sum + (p.stock_quantity * p.cost_price), 0)

  // Filter by stock status
  const filteredProducts = stockFilter === 'all' 
    ? products
    : stockFilter === 'low'
    ? products.filter(p => p.stock_quantity <= p.min_stock && p.stock_quantity > 0)
    : stockFilter === 'out'
    ? products.filter(p => p.stock_quantity <= 0)
    : products.filter(p => p.stock_quantity > p.min_stock)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        description="Control de stock y valorización de inventario"
      />

      <KPIGrid>
        <KPICard
          title="Total Productos"
          value={totalProducts.toString()}
          icon={Package}
          description="en catálogo"
        />
        <KPICard
          title="Stock Normal"
          value={(totalProducts - lowStockCount - outOfStockCount).toString()}
          icon={PackageCheck}
          description="productos OK"
        />
        <KPICard
          title="Stock Bajo"
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          description="requieren atención"
        />
        <KPICard
          title="Valor Total"
          value={formatCurrency(totalValue)}
          icon={PackageX}
          description="costo de inventario"
        />
      </KPIGrid>

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Buscar productos..."
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el stock</SelectItem>
                <SelectItem value="normal">Stock normal</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="out">Sin stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  )
}
