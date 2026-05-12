'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createInventoryAdjustment } from '@/lib/services'
import type { Product } from '@/lib/types'

interface AdjustStockFormProps {
  product: Product
  onSuccess?: () => void
}

interface FormValues {
  type: 'add' | 'subtract' | 'set'
  quantity: number
  notes: string
}

export function AdjustStockForm({ product, onSuccess }: AdjustStockFormProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      type: 'add',
      quantity: 0,
      notes: '',
    },
  })

  const watchType = form.watch('type')
  const watchQuantity = form.watch('quantity')

  const getNewStock = () => {
    const qty = watchQuantity || 0
    switch (watchType) {
      case 'add':
        return product.stock_quantity + qty
      case 'subtract':
        return Math.max(0, product.stock_quantity - qty)
      case 'set':
        return qty
      default:
        return product.stock_quantity
    }
  }

  const mutation = useMutation({
    mutationFn: ({ quantity, notes }: { quantity: number; notes: string }) =>
      createInventoryAdjustment(product.id, quantity, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['low-stock-products'] })
      toast.success('Stock ajustado correctamente')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Error al ajustar el stock')
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      let adjustmentQuantity: number
      
      switch (values.type) {
        case 'add':
          adjustmentQuantity = values.quantity
          break
        case 'subtract':
          adjustmentQuantity = -values.quantity
          break
        case 'set':
          adjustmentQuantity = values.quantity - product.stock_quantity
          break
        default:
          adjustmentQuantity = 0
      }
      
      await mutation.mutateAsync({
        quantity: adjustmentQuantity,
        notes: values.notes,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ajuste</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="add">Agregar stock</SelectItem>
                  <SelectItem value="subtract">Restar stock</SelectItem>
                  <SelectItem value="set">Establecer cantidad</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          rules={{ 
            required: 'La cantidad es requerida',
            min: { value: 0, message: 'La cantidad debe ser mayor a 0' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {watchType === 'set' ? 'Nueva Cantidad' : 'Cantidad'}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Stock resultante: <strong>{getNewStock()}</strong> unidades
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Razón del ajuste..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Opcional. Explica el motivo del ajuste para referencia futura.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Aplicar Ajuste'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
