'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Eye, MoreHorizontal, FileText, RotateCcw, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable, SortableHeader } from '@/components/shared/data-table'
import { SaleStatusBadge, PaymentStatusBadge } from '@/components/shared/status-badge'
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
import { Badge } from '@/components/ui/badge'
import { getSales } from '@/lib/services'
import { formatCurrency, formatRelativeDate } from '@/lib/utils/format'
import type { Sale } from '@/lib/types'

const paymentMethodLabels: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  mixto: 'Mixto',
}

const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'sale_number',
    header: 'Nro. Venta',
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.getValue('sale_number')}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column}>Fecha</SortableHeader>,
    cell: ({ row }) => formatRelativeDate(row.getValue('created_at')),
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const sale = row.original
      return (
        <div className="space-y-1">
          <p className="font-medium leading-none">
            {sale.customer?.name ?? 'Consumidor Final'}
          </p>
          {sale.customer?.code && (
            <p className="text-xs text-muted-foreground">{sale.customer.code}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'items_count',
    header: 'Items',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('items_count')} items</Badge>
    ),
  },
  {
    accessorKey: 'payment_method',
    header: 'Método',
    cell: ({ row }) => paymentMethodLabels[row.getValue('payment_method') as string],
  },
  {
    accessorKey: 'total',
    header: ({ column }) => <SortableHeader column={column}>Total</SortableHeader>,
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrency(row.getValue('total'))}</span>
    ),
  },
  {
    accessorKey: 'payment_status',
    header: 'Pago',
    cell: ({ row }) => <PaymentStatusBadge status={row.getValue('payment_status')} />,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => <SaleStatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const sale = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/ventas/${sale.id}`}>
                <Eye className="mr-2 size-4" />
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 size-4" />
              Imprimir ticket
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={sale.status !== 'completed'}
            >
              <RotateCcw className="mr-2 size-4" />
              Hacer devolución
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SalesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales', statusFilter, paymentFilter],
    queryFn: () => getSales({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      payment_method: paymentFilter !== 'all' ? paymentFilter : undefined,
      pageSize: 100,
    }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Historial de ventas realizadas"
        actions={
          <Button asChild>
            <Link href="/pos">
              <Plus className="mr-2 size-4" />
              Nueva Venta
            </Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={salesData?.data ?? []}
        loading={isLoading}
        searchKey="sale_number"
        searchPlaceholder="Buscar ventas..."
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
                <SelectItem value="refunded">Reembolsadas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  )
}
