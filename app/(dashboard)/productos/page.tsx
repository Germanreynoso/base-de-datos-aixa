'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Package } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable, SortableHeader } from '@/components/shared/data-table'
import { StockStatusBadge, StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@/components/ui/dialog'
import { getProducts, getCategories } from '@/lib/services'
import { formatCurrency } from '@/lib/utils/format'
import type { Product } from '@/lib/types'
import { ProductForm } from './product-form'

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
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium leading-none">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {product.category?.name ?? 'Sin categoría'}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'stock_quantity',
    header: ({ column }) => <SortableHeader column={column}>Stock</SortableHeader>,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{product.stock_quantity}</span>
          <StockStatusBadge quantity={product.stock_quantity} minStock={product.min_stock} />
        </div>
      )
    },
  },
  {
    accessorKey: 'cost_price',
    header: ({ column }) => <SortableHeader column={column}>Costo</SortableHeader>,
    cell: ({ row }) => formatCurrency(row.getValue('cost_price')),
  },
  {
    accessorKey: 'sale_price',
    header: ({ column }) => <SortableHeader column={column}>Precio</SortableHeader>,
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrency(row.getValue('sale_price'))}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' }> = {
        active: { label: 'Activo', variant: 'success' },
        inactive: { label: 'Inactivo', variant: 'warning' },
        discontinued: { label: 'Descontinuado', variant: 'error' },
      }
      const { label, variant } = statusMap[status] ?? { label: status, variant: 'default' as const }
      return <StatusBadge status={label} variant={variant} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/productos/${product.id}`}>
                <Eye className="mr-2 size-4" />
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/productos/${product.id}/editar`}>
                <Pencil className="mr-2 size-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', categoryFilter, statusFilter],
    queryFn: () => getProducts({
      category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      pageSize: 100,
    }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo de productos de tu tienda"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Nuevo Producto
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={productsData?.data ?? []}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="discontinued">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>
              Agrega un nuevo producto al catálogo
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
