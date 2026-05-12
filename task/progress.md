# Progreso de Implementación: Gestión de Stock en Supabase

## Estado Actual
- **Fase actual:** Completado
- **Bloqueantes:** Ninguno. El dashboard ya está conectado a Supabase.

## Tareas

### Fase 1: Base de Datos y Datos de Prueba
- [x] Crear archivo `task/init_db.sql` con esquema y mock data.
- [x] Crear tabla `categories` en Supabase (ejecutando el SQL).
- [x] Crear tabla `products` en Supabase (ejecutando el SQL).
- [x] Insertar productos y categorías de prueba (ejecutando el SQL).
- [x] Verificar políticas de seguridad (RLS).

### Fase 2: Conexión de Servicios
- [x] Refactorizar `getCategories`.
- [x] Refactorizar `getProducts` (incluyendo filtros y paginación).
- [x] Refactorizar `createProduct`.
- [x] Refactorizar `updateProduct`.
- [x] Refactorizar `deleteProduct`.

### Fase 3: UI, Estado y Refinamientos
- [x] Revisión del formulario de creación/edición (`ProductForm`).
- [x] Pruebas de creación, edición y eliminación de productos desde la UI.
- [x] Ajuste de notificaciones y manejo de errores.

### Fase 4: Ventas (POS)
- [x] Crear tabla `sales` y `sale_items` en Supabase (`task/sales_db.sql`).
- [x] Refactorizar `getSales` para leer de Supabase.
- [x] Refactorizar `createSale` para registrar ventas, items y actualizar stock.
