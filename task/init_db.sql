-- ==============================================================================
-- SCRIPT DE INICIALIZACIÓN: CATEGORÍAS Y PRODUCTOS
-- ==============================================================================

-- 0. Limpiar tablas existentes para evitar conflictos de columnas
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    supplier_id UUID, -- Referencia a suppliers
    
    -- Precios
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    wholesale_price NUMERIC(10, 2),
    
    -- Stock
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 5,
    max_stock INTEGER,
    
    -- Características
    unit TEXT NOT NULL DEFAULT 'unidad',
    weight NUMERIC(10, 2),
    brand TEXT,
    
    -- Estado
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    is_featured BOOLEAN DEFAULT false,
    
    -- Media
    image_url TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Metadatos
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Desactivar RLS temporalmente para desarrollo inicial (Se puede ajustar luego)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 4. Insertar datos de prueba (Mock Data)
-- Categorías
INSERT INTO public.categories (id, name, slug, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'Semillas', 'semillas', 'Semillas de colección y genéticas exclusivas'),
('c2000000-0000-0000-0000-000000000002', 'Fertilizantes', 'fertilizantes', 'Nutrientes y aditivos para todas las etapas'),
('c3000000-0000-0000-0000-000000000003', 'Sustratos', 'sustratos', 'Tierras preparadas, coco y mejoradores de suelo')
ON CONFLICT (id) DO NOTHING;

-- Productos de prueba
INSERT INTO public.products (id, sku, name, description, category_id, cost_price, sale_price, stock_quantity, min_stock, unit, status) VALUES
('a1000000-0000-0000-0000-000000000001', 'SEM-AMN-01', 'Amnesia Haze Feminizada x3', 'Semillas feminizadas de alta producción. Efecto sativa predominante.', 'c1000000-0000-0000-0000-000000000001', 12000, 25000, 45, 10, 'unidad', 'active'),
('a2000000-0000-0000-0000-000000000002', 'FER-ORO-1L', 'Oro Negro 1 Litro', 'Fertilizante orgánico de crecimiento a base de ácidos húmicos.', 'c2000000-0000-0000-0000-000000000002', 4500, 8900, 12, 15, 'litro', 'active'),
('a3000000-0000-0000-0000-000000000003', 'SUS-LIG-50L', 'Sustrato Light Mix 50L', 'Sustrato liviano ideal para germinación y primeros estadios.', 'c3000000-0000-0000-0000-000000000003', 6000, 11500, 8, 20, 'unidad', 'active'),
('a4000000-0000-0000-0000-000000000004', 'FER-FLO-500', 'Flora Booster 500ml', 'Potenciador de floración rico en PK. Aumenta peso y resina.', 'c2000000-0000-0000-0000-000000000002', 5200, 9800, 3, 10, 'unidad', 'active')
ON CONFLICT (id) DO NOTHING;
