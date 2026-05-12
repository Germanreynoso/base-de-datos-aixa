'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell, Moon, Sun, Command } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/lib/stores'

const pathLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  productos: 'Productos',
  categorias: 'Categorías',
  inventario: 'Inventario',
  movimientos: 'Movimientos',
  ajustes: 'Ajustes',
  ventas: 'Ventas',
  nueva: 'Nueva Venta',
  pos: 'Punto de Venta',
  clientes: 'Clientes',
  compras: 'Compras',
  proveedores: 'Proveedores',
  caja: 'Caja',
  reportes: 'Reportes',
  configuracion: 'Configuración',
  perfil: 'Mi Perfil',
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    breadcrumbs.push({
      label: pathLabels[segment] || segment,
      href: currentPath,
    })
  }

  return breadcrumbs
}

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const setCommandOpen = useUIStore((state) => state.setCommandOpen)
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground md:flex"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="size-4" />
          <span>Buscar...</span>
          <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <Command className="size-3" />K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative md:hidden"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <p className="text-sm font-medium">Notificaciones</p>
            </div>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">Stock bajo: Medidor pH Digital</p>
              <p className="text-xs text-muted-foreground">
                Solo quedan 2 unidades. Mínimo: 5
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">Orden recibida: OC-2024-0001</p>
              <p className="text-xs text-muted-foreground">
                20 productos de BSF Seeds
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">Nueva venta: V-2024-0003</p>
              <p className="text-xs text-muted-foreground">
                Ana Martínez - $84,180
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 size-4" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 size-4" />
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
