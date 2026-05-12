// =============================================================================
// TIPOS BASE DEL SISTEMA ERP/POS - GROWSHOP
// =============================================================================
// TODO: Estos tipos deben coincidir con tu esquema de Supabase
// Cuando conectes Supabase, puedes generar tipos automáticamente con:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.ts

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

export type UserRole = 'admin' | 'manager' | 'cashier' | 'warehouse'

export type ProductCategory = 
  | 'semillas'
  | 'fertilizantes'
  | 'sustratos'
  | 'iluminacion'
  | 'ventilacion'
  | 'riego'
  | 'control_clima'
  | 'control_plagas'
  | 'accesorios'
  | 'otros'

export type ProductStatus = 'active' | 'inactive' | 'discontinued'

export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'devolucion' | 'transferencia'

export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'mixto'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'

export type PurchaseStatus = 'pending' | 'received' | 'partial' | 'cancelled'

export type CashMovementType = 'apertura' | 'cierre' | 'ingreso' | 'egreso' | 'venta' | 'devolucion'

// -----------------------------------------------------------------------------
// ENTIDADES PRINCIPALES
// -----------------------------------------------------------------------------

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: ProductCategory
  description?: string
  image_url?: string
  parent_id?: string
  is_active: boolean
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  tax_id?: string // RUT/CUIT/NIF
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  barcode?: string
  name: string
  description?: string
  category_id: string
  category?: Category
  supplier_id?: string
  supplier?: Supplier
  
  // Precios
  cost_price: number
  sale_price: number
  wholesale_price?: number
  
  // Stock
  stock_quantity: number
  min_stock: number
  max_stock?: number
  
  // Características
  unit: string // 'unidad', 'kg', 'litro', 'gramo'
  weight?: number
  brand?: string
  
  // Estado
  status: ProductStatus
  is_featured: boolean
  
  // Media
  image_url?: string
  images?: string[]
  
  // Metadatos
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface InventoryMovement {
  id: string
  product_id: string
  product?: Product
  type: MovementType
  quantity: number
  previous_stock: number
  new_stock: number
  cost_per_unit?: number
  total_cost?: number
  reference_id?: string // ID de venta, compra, etc.
  reference_type?: 'sale' | 'purchase' | 'adjustment' | 'return'
  notes?: string
  created_by: string
  user?: User
  created_at: string
}

export interface Customer {
  id: string
  code: string // Código interno
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  tax_id?: string
  customer_type: 'retail' | 'wholesale' | 'vip'
  credit_limit?: number
  current_balance: number
  discount_percentage?: number
  notes?: string
  is_active: boolean
  total_purchases: number
  last_purchase_at?: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// VENTAS
// -----------------------------------------------------------------------------

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  discount_percentage: number
  discount_amount: number
  subtotal: number
  total: number
}

export interface SalePayment {
  id: string
  sale_id: string
  method: PaymentMethod
  amount: number
  reference?: string // Número de transferencia, voucher, etc.
  created_at: string
}

export interface Sale {
  id: string
  sale_number: string // Número de boleta/factura
  customer_id?: string
  customer?: Customer
  cashier_id: string
  cashier?: User
  
  // Totales
  subtotal: number
  discount_percentage: number
  discount_amount: number
  tax_amount: number
  total: number
  
  // Pago
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  amount_paid: number
  change_amount: number
  payments?: SalePayment[]
  
  // Items
  items: SaleItem[]
  items_count: number
  
  // Estado
  status: SaleStatus
  notes?: string
  
  // Metadatos
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// COMPRAS A PROVEEDORES
// -----------------------------------------------------------------------------

export interface PurchaseItem {
  id: string
  purchase_id: string
  product_id: string
  product?: Product
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  subtotal: number
}

export interface Purchase {
  id: string
  purchase_number: string
  supplier_id: string
  supplier?: Supplier
  
  // Totales
  subtotal: number
  tax_amount: number
  shipping_cost: number
  total: number
  
  // Estado
  status: PurchaseStatus
  
  // Items
  items: PurchaseItem[]
  
  // Pago
  payment_status: PaymentStatus
  amount_paid: number
  
  // Fechas
  order_date: string
  expected_date?: string
  received_date?: string
  
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// CAJA / CASH REGISTER
// -----------------------------------------------------------------------------

export interface CashSession {
  id: string
  cashier_id: string
  cashier?: User
  
  // Montos
  opening_amount: number
  closing_amount?: number
  expected_amount?: number
  difference?: number
  
  // Totales de ventas
  total_sales: number
  total_cash: number
  total_card: number
  total_transfer: number
  total_refunds: number
  
  // Estado
  is_open: boolean
  opened_at: string
  closed_at?: string
  
  notes?: string
}

export interface CashMovement {
  id: string
  session_id: string
  type: CashMovementType
  amount: number
  balance_after: number
  reference_id?: string
  reference_type?: 'sale' | 'refund' | 'expense' | 'manual'
  description?: string
  created_by: string
  user?: User
  created_at: string
}

// -----------------------------------------------------------------------------
// REPORTES Y ESTADÍSTICAS
// -----------------------------------------------------------------------------

export interface DashboardStats {
  // Ventas del día
  todaySales: number
  todayTransactions: number
  todayAvgTicket: number
  
  // Comparativas
  salesGrowth: number // Porcentaje vs ayer
  weekSales: number
  monthSales: number
  
  // Inventario
  lowStockProducts: number
  outOfStockProducts: number
  totalProducts: number
  
  // Clientes
  newCustomersToday: number
  activeCustomers: number
  
  // Caja
  cashInRegister: number
  pendingPayments: number
}

export interface SalesReport {
  period: string
  totalSales: number
  totalTransactions: number
  avgTicket: number
  topProducts: Array<{
    product: Product
    quantity: number
    total: number
  }>
  salesByCategory: Array<{
    category: string
    total: number
    percentage: number
  }>
  salesByPaymentMethod: Array<{
    method: PaymentMethod
    total: number
    count: number
  }>
  salesByHour: Array<{
    hour: number
    total: number
    count: number
  }>
}

// -----------------------------------------------------------------------------
// CONFIGURACIÓN
// -----------------------------------------------------------------------------

export interface StoreConfig {
  id: string
  store_name: string
  store_address?: string
  store_phone?: string
  store_email?: string
  tax_id?: string
  logo_url?: string
  
  // Configuración fiscal
  tax_rate: number // IVA %
  currency: string
  currency_symbol: string
  
  // Configuración de tickets
  ticket_header?: string
  ticket_footer?: string
  print_logo: boolean
  
  // Configuración de inventario
  low_stock_threshold: number
  allow_negative_stock: boolean
  
  // Configuración de ventas
  default_discount: number
  require_customer: boolean
  
  updated_at: string
}

// -----------------------------------------------------------------------------
// TIPOS DE API / PAGINACIÓN
// -----------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface QueryFilters {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: string | number | boolean | undefined
}

// -----------------------------------------------------------------------------
// TIPOS PARA EL POS
// -----------------------------------------------------------------------------

export interface CartItem {
  product: Product
  quantity: number
  unit_price: number
  discount_percentage: number
  discount_amount: number
  subtotal: number
  total: number
}

export interface Cart {
  items: CartItem[]
  customer?: Customer
  subtotal: number
  discount_percentage: number
  discount_amount: number
  tax_amount: number
  total: number
}

export interface POSPayment {
  method: PaymentMethod
  amount: number
  reference?: string
}
