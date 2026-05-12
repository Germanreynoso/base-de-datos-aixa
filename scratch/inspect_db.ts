
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspect() {
  console.log('--- Inspeccionando Base de Datos ---')
  
  // Lista de tablas que sospecho que podrías tener según el contexto de un ERP/Growshop
  const potentialTables = [
    'productos', 'stock', 'ventas', 'clientes', 'sucursales', 
    'products', 'inventory', 'sales', 'clients', 'branches',
    'profiles', 'users', 'categorias', 'categories'
  ]
  
  console.log('Buscando tablas...')
  const existingTables = []

  for (const table of potentialTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (!error || (error.code !== 'PGRST116' && error.code !== '42P01')) {
        existingTables.push(table)
      }
    } catch (e) {
      // Ignorar errores de red o conexión
    }
  }

  if (existingTables.length > 0) {
    console.log('✅ Tablas encontradas:', existingTables.join(', '))
    
    for (const table of existingTables) {
      console.log(`\n--- Estructura de: ${table} ---`)
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (data && data.length > 0) {
        console.log('Campos:', Object.keys(data[0]).join(', '))
        // Intentar contar registros
        const { count, error: countError } = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (!countError) console.log(`Registros: ${count}`)
      } else {
        console.log('La tabla existe pero está vacía o no tiene permisos de lectura.')
      }
    }
  } else {
    console.log('❌ No encontré tablas con nombres comunes.')
    console.log('Probando consulta directa a pg_catalog (requiere permisos)...')
    const { data, error } = await supabase.rpc('get_tables') // A veces hay un RPC personalizado
    if (error) {
       console.log('No se pudo determinar el esquema automáticamente.')
       console.log('¿Me podrías decir el nombre de una tabla que sepas que existe?')
    } else {
       console.log('Tablas vía RPC:', data)
    }
  }
}

inspect()
