import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Sembrando categorías...')
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Semillas', slug: 'semillas', description: 'Semillas de colección y genéticas exclusivas' },
    { id: 'c2000000-0000-0000-0000-000000000002', name: 'Fertilizantes', slug: 'fertilizantes', description: 'Nutrientes y aditivos para todas las etapas' },
    { id: 'c3000000-0000-0000-0000-000000000003', name: 'Sustratos', slug: 'sustratos', description: 'Tierras preparadas, coco y mejoradores de suelo' }
  ]
  const { error: catError } = await supabase.from('categories').upsert(categories)
  if (catError) console.error('Error insertando categorías:', catError)

  console.log('Sembrando productos...')
  const products = [
    { id: 'a1000000-0000-0000-0000-000000000001', sku: 'SEM-AMN-01', name: 'Amnesia Haze Feminizada x3', description: 'Semillas feminizadas de alta producción. Efecto sativa predominante.', category_id: 'c1000000-0000-0000-0000-000000000001', cost_price: 12000, sale_price: 25000, stock_quantity: 45, min_stock: 10, unit: 'unidad', status: 'active' },
    { id: 'a2000000-0000-0000-0000-000000000002', sku: 'FER-ORO-1L', name: 'Oro Negro 1 Litro', description: 'Fertilizante orgánico de crecimiento a base de ácidos húmicos.', category_id: 'c2000000-0000-0000-0000-000000000002', cost_price: 4500, sale_price: 8900, stock_quantity: 12, min_stock: 15, unit: 'litro', status: 'active' },
    { id: 'a3000000-0000-0000-0000-000000000003', sku: 'SUS-LIG-50L', name: 'Sustrato Light Mix 50L', description: 'Sustrato liviano ideal para germinación y primeros estadios.', category_id: 'c3000000-0000-0000-0000-000000000003', cost_price: 6000, sale_price: 11500, stock_quantity: 8, min_stock: 20, unit: 'unidad', status: 'active' },
    { id: 'a4000000-0000-0000-0000-000000000004', sku: 'FER-FLO-500', name: 'Flora Booster 500ml', description: 'Potenciador de floración rico en PK. Aumenta peso y resina.', category_id: 'c2000000-0000-0000-0000-000000000002', cost_price: 5200, sale_price: 9800, stock_quantity: 3, min_stock: 10, unit: 'unidad', status: 'active' }
  ]
  const { error: prodError } = await supabase.from('products').upsert(products)
  if (prodError) console.error('Error insertando productos:', prodError)

  console.log('¡Listo! Revisa tu dashboard.')
}

seed()
