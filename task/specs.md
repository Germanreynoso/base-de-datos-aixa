# Especificaciones: Integración de Gestión de Stock con Supabase

## Objetivo
Reemplazar el sistema de datos estáticos (mock data) del dashboard de inventario por una conexión real a Supabase, permitiendo realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los productos y categorías de la tienda.

## Alcance
- Creación de esquema SQL en Supabase para `categories` y `products`.
- Generación de datos de prueba (seeding) directamente en la base de datos.
- Refactorización de `lib/services/index.ts` para usar el cliente de Supabase.
- Integración fluida con React Query y la UI existente (`app/(dashboard)/productos/page.tsx` y `ProductForm`).

## Fases de Implementación

### Fase 1: Base de Datos y Datos de Prueba
- [ ] Ejecutar script SQL para crear la tabla `categories`.
- [ ] Ejecutar script SQL para crear la tabla `products` con todas las columnas definidas en `lib/types/index.ts`.
- [ ] Insertar datos semilla (mock data) en ambas tablas.
- [ ] Configurar políticas RLS (Row Level Security) para permitir operaciones desde el dashboard.

### Fase 2: Conexión de Servicios
- [ ] Modificar `getCategories` en `lib/services/index.ts` para hacer fetch a Supabase.
- [ ] Modificar `getProducts` y `getProductById` para obtener datos reales, incluyendo relaciones con `categories`.
- [ ] Implementar mutaciones en los servicios: `createProduct`, `updateProduct`, `deleteProduct`.
- [ ] Gestionar filtros (búsqueda, estado, categoría) en la query de Supabase.

### Fase 3: UI, Estado y Refinamientos
- [ ] Actualizar el componente `ProductForm` para que maneje correctamente las promesas de los servicios.
- [ ] Confirmar que React Query invalide las queries `['products']` tras una mutación exitosa para refrescar la tabla automáticamente.
- [ ] Manejo de notificaciones de éxito/error (usando notificaciones Toast).
