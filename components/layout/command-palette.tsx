'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Store,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  Search,
  FileText,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useUIStore } from '@/lib/stores'

interface CommandItem {
  icon: React.ElementType
  label: string
  shortcut?: string
  action: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const { commandOpen, setCommandOpen } = useUIStore()
  const [search, setSearch] = useState('')

  const navigate = useCallback((path: string) => {
    router.push(path)
    setCommandOpen(false)
  }, [router, setCommandOpen])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandOpen, setCommandOpen])

  const navigationItems: CommandItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', shortcut: 'D', action: () => navigate('/dashboard') },
    { icon: Package, label: 'Productos', shortcut: 'P', action: () => navigate('/productos') },
    { icon: Warehouse, label: 'Inventario', shortcut: 'I', action: () => navigate('/inventario') },
    { icon: ShoppingCart, label: 'Ventas', shortcut: 'V', action: () => navigate('/ventas') },
    { icon: Store, label: 'Punto de Venta', shortcut: 'POS', action: () => navigate('/pos') },
    { icon: Users, label: 'Clientes', shortcut: 'C', action: () => navigate('/clientes') },
    { icon: Truck, label: 'Compras', action: () => navigate('/compras') },
    { icon: Wallet, label: 'Caja', action: () => navigate('/caja') },
    { icon: BarChart3, label: 'Reportes', shortcut: 'R', action: () => navigate('/reportes') },
    { icon: Settings, label: 'Configuración', action: () => navigate('/configuracion') },
  ]

  const actionItems: CommandItem[] = [
    { icon: Plus, label: 'Nueva Venta', shortcut: 'N', action: () => navigate('/pos') },
    { icon: Plus, label: 'Nuevo Producto', action: () => navigate('/productos/nuevo') },
    { icon: Plus, label: 'Nuevo Cliente', action: () => navigate('/clientes/nuevo') },
    { icon: Plus, label: 'Nueva Orden de Compra', action: () => navigate('/compras/nueva') },
    { icon: FileText, label: 'Reporte de Ventas del Día', action: () => navigate('/reportes/ventas') },
  ]

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput 
        placeholder="Buscar páginas, acciones, productos..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        <CommandGroup heading="Navegación">
          {navigationItems.map((item) => (
            <CommandItem key={item.label} onSelect={item.action}>
              <item.icon className="mr-2 size-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Acciones Rápidas">
          {actionItems.map((item) => (
            <CommandItem key={item.label} onSelect={item.action}>
              <item.icon className="mr-2 size-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
