import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error, count } = await supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
  
  if (error) {
    console.error('Error fetching products:', error)
  } else {
    console.log('Products fetched successfully:')
    console.log(`Count: ${count}`)
    console.log(data)
  }
}

test()
