// =============================================================================
// SERVICIOS DEL SISTEMA ERP/POS - GROWSHOP
// =============================================================================
// TODO: Reemplazar las funciones mock con llamadas a Supabase
// 
// Cuando conectes Supabase:
// 1. Importa el cliente: import { createClient } from '@/lib/supabase/client'
// 2. Reemplaza cada función mock con la query correspondiente
// 3. Ejemplo:
//    export async function getProducts() {
//      const supabase = createClient()
//      const { data, error } = await supabase
//        .from('products')
//        .select('*, category:categories(*), supplier:suppliers(*)')
//        .order('name')
//      if (error) throw error
//      return data
//    }

import type {
  Product,
  Category,
  Supplier,
  Customer,
  Sale,
  Purchase,
  InventoryMovement,
  CashSession,
  User,
  DashboardStats,
  StoreConfig,
  PaginatedResponse,
  QueryFilters,
  CartItem,
  POSPayment,
} from '@/lib/types'

import {
  mockProducts,
  mockCategories,
  mockSuppliers,
  mockCustomers,
  mockSales,
  mockPurchases,
  mockInventoryMovements,
  mockCashSession,
  mockUsers,
  mockDashboardStats,
  mockStoreConfig,
  mockSalesChartData,
  mockSalesByCategoryData,
  mockTopProductsData,
  mockSalesByHourData,
} from '@/lib/data/mock-data'

// Simular latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// =============================================================================
// PRODUCTOS
// =============================================================================

export async function getProducts(filters?: QueryFilters): Promise<PaginatedResponse<Product>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockProducts]
  
  // Filtrar por búsqueda
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search) ||
      p.barcode?.toLowerCase().includes(search)
    )
  }
  
  // Filtrar por categoría
  if (filters?.category_id) {
    filtered = filtered.filter(p => p.category_id === filters.category_id)
  }
  
  // Filtrar por estado
  if (filters?.status) {
    filtered = filtered.filter(p => p.status === filters.status)
  }
  
  // Filtrar por stock bajo
  if (filters?.low_stock) {
    filtered = filtered.filter(p => p.stock_quantity <= p.min_stock)
  }
  
  // Paginación
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockProducts.find(p => p.id === id) || null
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  // TODO: Reemplazar con Supabase query
  await delay(100)
  return mockProducts.find(p => p.barcode === barcode) || null
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  // TODO: Reemplazar con Supabase insert
  await delay(300)
  const newProduct: Product = {
    ...product,
    id: String(mockProducts.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  // TODO: Reemplazar con Supabase update
  await delay(300)
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Producto no encontrado')
  
  mockProducts[index] = {
    ...mockProducts[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return mockProducts[index]
}

export async function deleteProduct(id: string): Promise<void> {
  // TODO: Reemplazar con Supabase delete
  await delay(200)
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Producto no encontrado')
  mockProducts.splice(index, 1)
}

export async function getLowStockProducts(): Promise<Product[]> {
  // TODO: Reemplazar con Supabase query con filtro stock <= min_stock
  await delay(200)
  return mockProducts.filter(p => p.stock_quantity <= p.min_stock)
}

// =============================================================================
// CATEGORÍAS
// =============================================================================

export async function getCategories(): Promise<Category[]> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockCategories
}

export async function getCategoryById(id: string): Promise<Category | null> {
  // TODO: Reemplazar con Supabase query
  await delay(100)
  return mockCategories.find(c => c.id === id) || null
}

// =============================================================================
// PROVEEDORES
// =============================================================================

export async function getSuppliers(filters?: QueryFilters): Promise<PaginatedResponse<Supplier>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockSuppliers]
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(search) ||
      s.contact_name?.toLowerCase().includes(search)
    )
  }
  
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  // TODO: Reemplazar con Supabase query
  await delay(100)
  return mockSuppliers.find(s => s.id === id) || null
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
  // TODO: Reemplazar con Supabase insert
  await delay(300)
  const newSupplier: Supplier = {
    ...supplier,
    id: String(mockSuppliers.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockSuppliers.push(newSupplier)
  return newSupplier
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
  // TODO: Reemplazar con Supabase update
  await delay(300)
  const index = mockSuppliers.findIndex(s => s.id === id)
  if (index === -1) throw new Error('Proveedor no encontrado')
  
  mockSuppliers[index] = {
    ...mockSuppliers[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return mockSuppliers[index]
}

// =============================================================================
// CLIENTES
// =============================================================================

export async function getCustomers(filters?: QueryFilters): Promise<PaginatedResponse<Customer>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockCustomers]
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search)
    )
  }
  
  if (filters?.customer_type) {
    filtered = filtered.filter(c => c.customer_type === filters.customer_type)
  }
  
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  // TODO: Reemplazar con Supabase query
  await delay(100)
  return mockCustomers.find(c => c.id === id) || null
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_purchases'>): Promise<Customer> {
  // TODO: Reemplazar con Supabase insert
  await delay(300)
  const newCustomer: Customer = {
    ...customer,
    id: String(mockCustomers.length + 1),
    total_purchases: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockCustomers.push(newCustomer)
  return newCustomer
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  // TODO: Reemplazar con Supabase update
  await delay(300)
  const index = mockCustomers.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Cliente no encontrado')
  
  mockCustomers[index] = {
    ...mockCustomers[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return mockCustomers[index]
}

// =============================================================================
// VENTAS
// =============================================================================

export async function getSales(filters?: QueryFilters): Promise<PaginatedResponse<Sale>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockSales]
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(s => 
      s.sale_number.toLowerCase().includes(search) ||
      s.customer?.name.toLowerCase().includes(search)
    )
  }
  
  if (filters?.status) {
    filtered = filtered.filter(s => s.status === filters.status)
  }
  
  if (filters?.date_from) {
    filtered = filtered.filter(s => s.created_at >= filters.date_from!)
  }
  
  if (filters?.date_to) {
    filtered = filtered.filter(s => s.created_at <= filters.date_to!)
  }
  
  // Ordenar por fecha descendente
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function getSaleById(id: string): Promise<Sale | null> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockSales.find(s => s.id === id) || null
}

export async function createSale(
  items: CartItem[],
  payments: POSPayment[],
  customerId?: string,
  discountPercentage?: number
): Promise<Sale> {
  // TODO: Reemplazar con Supabase transaction
  // Esta función debe:
  // 1. Crear la venta
  // 2. Crear los items de venta
  // 3. Registrar los pagos
  // 4. Actualizar el stock de cada producto
  // 5. Crear movimientos de inventario
  // 6. Actualizar el total de compras del cliente
  await delay(500)
  
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const discountAmount = subtotal * ((discountPercentage || 0) / 100)
  const taxAmount = (subtotal - discountAmount) * 0.21 // 21% IVA
  const total = subtotal - discountAmount + taxAmount
  const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  
  const newSale: Sale = {
    id: String(mockSales.length + 1),
    sale_number: `V-2024-${String(mockSales.length + 1).padStart(4, '0')}`,
    customer_id: customerId,
    customer: customerId ? mockCustomers.find(c => c.id === customerId) : undefined,
    cashier_id: '3',
    cashier: mockUsers[2],
    subtotal,
    discount_percentage: discountPercentage || 0,
    discount_amount: discountAmount,
    tax_amount: taxAmount,
    total,
    payment_method: payments.length === 1 ? payments[0].method : 'mixto',
    payment_status: amountPaid >= total ? 'paid' : 'partial',
    amount_paid: amountPaid,
    change_amount: Math.max(0, amountPaid - total),
    items: items.map((item, idx) => ({
      id: String(idx + 1),
      sale_id: String(mockSales.length + 1),
      product_id: item.product.id,
      product: item.product,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_percentage: item.discount_percentage,
      discount_amount: item.discount_amount,
      subtotal: item.subtotal,
      total: item.total,
    })),
    items_count: items.length,
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockSales.unshift(newSale)
  return newSale
}

export async function cancelSale(id: string): Promise<Sale> {
  // TODO: Reemplazar con Supabase update + revertir stock
  await delay(300)
  const index = mockSales.findIndex(s => s.id === id)
  if (index === -1) throw new Error('Venta no encontrada')
  
  mockSales[index] = {
    ...mockSales[index],
    status: 'cancelled',
    updated_at: new Date().toISOString(),
  }
  return mockSales[index]
}

// =============================================================================
// COMPRAS
// =============================================================================

export async function getPurchases(filters?: QueryFilters): Promise<PaginatedResponse<Purchase>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockPurchases]
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.purchase_number.toLowerCase().includes(search) ||
      p.supplier?.name.toLowerCase().includes(search)
    )
  }
  
  if (filters?.status) {
    filtered = filtered.filter(p => p.status === filters.status)
  }
  
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockPurchases.find(p => p.id === id) || null
}

export async function createPurchase(purchase: Omit<Purchase, 'id' | 'purchase_number' | 'created_at' | 'updated_at'>): Promise<Purchase> {
  // TODO: Reemplazar con Supabase insert
  await delay(400)
  const newPurchase: Purchase = {
    ...purchase,
    id: String(mockPurchases.length + 1),
    purchase_number: `OC-2024-${String(mockPurchases.length + 1).padStart(4, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockPurchases.push(newPurchase)
  return newPurchase
}

export async function receivePurchase(id: string, items: { product_id: string; quantity_received: number }[]): Promise<Purchase> {
  // TODO: Reemplazar con Supabase transaction
  // Esta función debe:
  // 1. Actualizar las cantidades recibidas
  // 2. Actualizar el stock de productos
  // 3. Crear movimientos de inventario
  await delay(400)
  
  const index = mockPurchases.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Compra no encontrada')
  
  mockPurchases[index] = {
    ...mockPurchases[index],
    status: 'received',
    received_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  return mockPurchases[index]
}

// =============================================================================
// INVENTARIO
// =============================================================================

export async function getInventoryMovements(filters?: QueryFilters): Promise<PaginatedResponse<InventoryMovement>> {
  // TODO: Reemplazar con Supabase query
  await delay(300)
  
  let filtered = [...mockInventoryMovements]
  
  if (filters?.product_id) {
    filtered = filtered.filter(m => m.product_id === filters.product_id)
  }
  
  if (filters?.type) {
    filtered = filtered.filter(m => m.type === filters.type)
  }
  
  // Ordenar por fecha descendente
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const start = (page - 1) * pageSize
  
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function createInventoryAdjustment(
  productId: string,
  quantity: number,
  notes?: string
): Promise<InventoryMovement> {
  // TODO: Reemplazar con Supabase transaction
  await delay(300)
  
  const product = mockProducts.find(p => p.id === productId)
  if (!product) throw new Error('Producto no encontrado')
  
  const previousStock = product.stock_quantity
  const newStock = previousStock + quantity
  
  const movement: InventoryMovement = {
    id: String(mockInventoryMovements.length + 1),
    product_id: productId,
    product,
    type: 'ajuste',
    quantity,
    previous_stock: previousStock,
    new_stock: newStock,
    notes,
    created_by: '4',
    user: mockUsers[3],
    created_at: new Date().toISOString(),
  }
  
  // Actualizar stock del producto
  product.stock_quantity = newStock
  
  mockInventoryMovements.unshift(movement)
  return movement
}

// =============================================================================
// CAJA
// =============================================================================

export async function getCurrentCashSession(): Promise<CashSession | null> {
  // TODO: Reemplazar con Supabase query buscando sesión abierta
  await delay(200)
  return mockCashSession.is_open ? mockCashSession : null
}

export async function openCashSession(openingAmount: number): Promise<CashSession> {
  // TODO: Reemplazar con Supabase insert
  await delay(300)
  
  const session: CashSession = {
    id: String(Date.now()),
    cashier_id: '3',
    cashier: mockUsers[2],
    opening_amount: openingAmount,
    total_sales: 0,
    total_cash: 0,
    total_card: 0,
    total_transfer: 0,
    total_refunds: 0,
    is_open: true,
    opened_at: new Date().toISOString(),
  }
  
  Object.assign(mockCashSession, session)
  return session
}

export async function closeCashSession(closingAmount: number, notes?: string): Promise<CashSession> {
  // TODO: Reemplazar con Supabase update
  await delay(300)
  
  const expectedAmount = mockCashSession.opening_amount + mockCashSession.total_cash - mockCashSession.total_refunds
  
  Object.assign(mockCashSession, {
    closing_amount: closingAmount,
    expected_amount: expectedAmount,
    difference: closingAmount - expectedAmount,
    is_open: false,
    closed_at: new Date().toISOString(),
    notes,
  })
  
  return mockCashSession
}

// =============================================================================
// USUARIOS Y AUTENTICACIÓN
// =============================================================================

export async function getCurrentUser(): Promise<User | null> {
  // TODO: Reemplazar con Supabase Auth
  await delay(100)
  return mockUsers[0] // Retorna admin por defecto
}

export async function getUsers(): Promise<User[]> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockUsers
}

export async function login(email: string, password: string): Promise<User> {
  // TODO: Reemplazar con Supabase Auth signInWithPassword
  await delay(500)
  
  const user = mockUsers.find(u => u.email === email)
  if (!user) throw new Error('Credenciales inválidas')
  
  return user
}

export async function logout(): Promise<void> {
  // TODO: Reemplazar con Supabase Auth signOut
  await delay(200)
}

// =============================================================================
// DASHBOARD Y REPORTES
// =============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: Reemplazar con Supabase queries agregadas
  await delay(400)
  return mockDashboardStats
}

export async function getSalesChartData(days: number = 7) {
  // TODO: Reemplazar con Supabase query con GROUP BY fecha
  await delay(300)
  return mockSalesChartData.slice(-days)
}

export async function getSalesByCategoryData() {
  // TODO: Reemplazar con Supabase query con GROUP BY categoría
  await delay(300)
  return mockSalesByCategoryData
}

export async function getTopProductsData(limit: number = 5) {
  // TODO: Reemplazar con Supabase query con ORDER BY cantidad vendida
  await delay(300)
  return mockTopProductsData.slice(0, limit)
}

export async function getSalesByHourData() {
  // TODO: Reemplazar con Supabase query con GROUP BY hora
  await delay(300)
  return mockSalesByHourData
}

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

export async function getStoreConfig(): Promise<StoreConfig> {
  // TODO: Reemplazar con Supabase query
  await delay(200)
  return mockStoreConfig
}

export async function updateStoreConfig(data: Partial<StoreConfig>): Promise<StoreConfig> {
  // TODO: Reemplazar con Supabase update
  await delay(300)
  Object.assign(mockStoreConfig, {
    ...data,
    updated_at: new Date().toISOString(),
  })
  return mockStoreConfig
}
