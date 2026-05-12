-- ==============================================================================
-- SCRIPT DE INICIALIZACIÓN: VENTAS
-- ==============================================================================

-- 1. Limpiar tablas existentes si las hubiera
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;

-- 2. Crear tabla de ventas (sales)
CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_number TEXT NOT NULL,
    customer_id UUID, -- Referencia a customers (opcional por ahora)
    cashier_id TEXT, -- Puede ser el ID del usuario en el futuro
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    tax_amount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    change_amount NUMERIC(10, 2) DEFAULT 0,
    items_count INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de items de venta (sale_items)
CREATE TABLE public.sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    subtotal NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL
);

-- 4. Habilitar RLS y configurar permisos para la web
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
