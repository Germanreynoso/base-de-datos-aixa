'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  LogOut,
  ChevronDown,
  Building2,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Productos',
    url: '/productos',
    icon: Package,
    items: [
      { title: 'Catálogo', url: '/productos' },
      { title: 'Categorías', url: '/productos/categorias' },
    ],
  },
  {
    title: 'Inventario',
    url: '/inventario',
    icon: Warehouse,
    items: [
      { title: 'Stock', url: '/inventario' },
      { title: 'Movimientos', url: '/inventario/movimientos' },
      { title: 'Ajustes', url: '/inventario/ajustes' },
    ],
  },
  {
    title: 'Ventas',
    url: '/ventas',
    icon: ShoppingCart,
    items: [
      { title: 'Historial', url: '/ventas' },
      { title: 'Nueva Venta', url: '/ventas/nueva' },
    ],
  },
  {
    title: 'Punto de Venta',
    url: '/pos',
    icon: Store,
  },
]

const secondaryNavItems = [
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Compras',
    url: '/compras',
    icon: Truck,
    items: [
      { title: 'Órdenes', url: '/compras' },
      { title: 'Proveedores', url: '/compras/proveedores' },
    ],
  },
  {
    title: 'Caja',
    url: '/caja',
    icon: Wallet,
  },
  {
    title: 'Reportes',
    url: '/reportes',
    icon: BarChart3,
    items: [
      { title: 'Ventas', url: '/reportes/ventas' },
      { title: 'Productos', url: '/reportes/productos' },
      { title: 'Inventario', url: '/reportes/inventario' },
    ],
  },
]

const bottomNavItems = [
  {
    title: 'Configuración',
    url: '/configuracion',
    icon: Settings,
  },
]

interface NavItemProps {
  item: {
    title: string
    url: string
    icon: React.ElementType
    items?: { title: string; url: string }[]
  }
  pathname: string
}

function NavItem({ item, pathname }: NavItemProps) {
  const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
  const hasSubItems = item.items && item.items.length > 0

  if (hasSubItems) {
    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(isActive && 'bg-sidebar-accent')}
            >
              <item.icon className="size-4" />
              <span>{item.title}</span>
              <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.url}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <Link href={subItem.url}>{subItem.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
      >
        <Link href={item.url}>
          <item.icon className="size-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">GrowShop Pro</span>
                  <span className="text-xs text-muted-foreground">
                    Sistema de Gestión
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavItem key={item.url} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <NavItem key={item.url} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <NavItem key={item.url} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      CA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      Carlos Administrador
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      admin@growshop.com
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === 'collapsed' ? 'right' : 'top'}
                align="start"
                className="w-56"
              >
                <DropdownMenuItem asChild>
                  <Link href="/configuracion/perfil">
                    <Settings className="mr-2 size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
