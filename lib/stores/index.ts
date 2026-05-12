// =============================================================================
// STORES GLOBALES - ZUSTAND
// =============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Product, Customer, CartItem, StoreConfig, CashSession } from '@/lib/types'

// =============================================================================
// AUTH STORE
// =============================================================================

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// =============================================================================
// POS / CART STORE
// =============================================================================

interface POSState {
  // Carrito
  items: CartItem[]
  customer: Customer | null
  globalDiscount: number
  notes: string
  
  // Calculados
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  
  // Acciones del carrito
  addItem: (product: Product, quantity?: number) => void
  updateItemQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  setItemDiscount: (productId: string, discount: number) => void
  clearCart: () => void
  
  // Cliente
  setCustomer: (customer: Customer | null) => void
  
  // Descuento global
  setGlobalDiscount: (discount: number) => void
  
  // Notas
  setNotes: (notes: string) => void
}

const calculateCartTotals = (items: CartItem[], globalDiscount: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const itemDiscounts = items.reduce((sum, item) => sum + item.discount_amount, 0)
  const globalDiscountAmount = (subtotal - itemDiscounts) * (globalDiscount / 100)
  const discountAmount = itemDiscounts + globalDiscountAmount
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * 0.21 // 21% IVA
  const total = taxableAmount + taxAmount
  
  return { subtotal, discountAmount, taxAmount, total }
}

const createCartItem = (product: Product, quantity: number, discount: number = 0): CartItem => {
  const subtotal = product.sale_price * quantity
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount
  
  return {
    product,
    quantity,
    unit_price: product.sale_price,
    discount_percentage: discount,
    discount_amount: discountAmount,
    subtotal,
    total,
  }
}

export const usePOSStore = create<POSState>()((set, get) => ({
  items: [],
  customer: null,
  globalDiscount: 0,
  notes: '',
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  total: 0,
  
  addItem: (product, quantity = 1) => {
    const { items, globalDiscount } = get()
    const existingIndex = items.findIndex(item => item.product.id === product.id)
    
    let newItems: CartItem[]
    
    if (existingIndex >= 0) {
      // Incrementar cantidad si ya existe
      newItems = items.map((item, idx) => 
        idx === existingIndex 
          ? createCartItem(product, item.quantity + quantity, item.discount_percentage)
          : item
      )
    } else {
      // Agregar nuevo item
      newItems = [...items, createCartItem(product, quantity)]
    }
    
    const totals = calculateCartTotals(newItems, globalDiscount)
    set({ items: newItems, ...totals })
  },
  
  updateItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    const { items, globalDiscount } = get()
    const newItems = items.map(item => 
      item.product.id === productId 
        ? createCartItem(item.product, quantity, item.discount_percentage)
        : item
    )
    
    const totals = calculateCartTotals(newItems, globalDiscount)
    set({ items: newItems, ...totals })
  },
  
  removeItem: (productId) => {
    const { items, globalDiscount } = get()
    const newItems = items.filter(item => item.product.id !== productId)
    const totals = calculateCartTotals(newItems, globalDiscount)
    set({ items: newItems, ...totals })
  },
  
  setItemDiscount: (productId, discount) => {
    const { items, globalDiscount } = get()
    const newItems = items.map(item => 
      item.product.id === productId 
        ? createCartItem(item.product, item.quantity, discount)
        : item
    )
    
    const totals = calculateCartTotals(newItems, globalDiscount)
    set({ items: newItems, ...totals })
  },
  
  clearCart: () => set({
    items: [],
    customer: null,
    globalDiscount: 0,
    notes: '',
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
  }),
  
  setCustomer: (customer) => {
    // Aplicar descuento del cliente automáticamente
    const discount = customer?.discount_percentage || 0
    const { items } = get()
    const totals = calculateCartTotals(items, discount)
    set({ customer, globalDiscount: discount, ...totals })
  },
  
  setGlobalDiscount: (discount) => {
    const { items } = get()
    const totals = calculateCartTotals(items, discount)
    set({ globalDiscount: discount, ...totals })
  },
  
  setNotes: (notes) => set({ notes }),
}))

// =============================================================================
// CASH SESSION STORE
// =============================================================================

interface CashSessionState {
  session: CashSession | null
  isOpen: boolean
  setSession: (session: CashSession | null) => void
  updateSession: (data: Partial<CashSession>) => void
}

export const useCashSessionStore = create<CashSessionState>()((set) => ({
  session: null,
  isOpen: false,
  setSession: (session) => set({ session, isOpen: session?.is_open ?? false }),
  updateSession: (data) => set((state) => ({
    session: state.session ? { ...state.session, ...data } : null,
  })),
}))

// =============================================================================
// UI STORE
// =============================================================================

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  commandOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCommandOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      commandOpen: false,
      theme: 'system',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCommandOpen: (open) => set({ commandOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
)

// =============================================================================
// STORE CONFIG
// =============================================================================

interface StoreConfigState {
  config: StoreConfig | null
  setConfig: (config: StoreConfig) => void
}

export const useStoreConfigStore = create<StoreConfigState>()((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}))
