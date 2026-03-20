# 🔧 Setup Supabase - Quick Fix

## El problema
El login está pegado porque **Supabase aún no tiene las tablas ni usuarios de prueba**.

## Solución Rápida (5 minutos)

### Paso 1: Aplicar Migraciones SQL
1. Abre: https://app.supabase.com/project/kttbmxpmvmsakxfbelen/sql
2. **Copia TODO el contenido de estos archivos y pégalo en la consola SQL:**
   - `supabase/migrations/20260320184232_08b6f801-c7ff-45e9-b6f1-2709a71e9a7b.sql`
   - `supabase/migrations/20260320184244_d07abe37-0e83-4d40-b8b3-882fd7504400.sql`
3. Haz clic en **"RUN"**

### Paso 2: Crear Usuario de Prueba
En la misma consola SQL, ejecuta esto:

```sql
-- 1. Crear usuario
SELECT auth.create_user(
  email := 'admin@empresa.cl',
  password := 'admin123',
  email_confirm := true
);

-- 2. Obtener el ID del usuario (la consola te lo mostrará)
-- Copia ese UUID y úsalo en los próximos pasos

-- 3. Crear perfiles (reemplaza UUID_AQUI con el ID del usuario)
INSERT INTO profiles (user_id, first_name, last_name, email, is_active)
VALUES ('UUID_AQUI', 'Carlos', 'Mendoza', 'admin@empresa.cl', true);

-- 4. Asignar rol
INSERT INTO user_roles (user_id, role)
VALUES ('UUID_AQUI', 'superadmin');
```

### Paso 3: Probar Login
1. El servidor ya está corriendo en: **http://localhost:8081/**
2. Intenta loggear con:
   - Email: `admin@empresa.cl`
   - Password: `admin123`

## Credenciales de Prueba (después de setup)
```
Admin: admin@empresa.cl / admin123
RRHH: rrhh@empresa.cl / rrhh123
Finance: finanzas@empresa.cl / finanzas123
Worker: juan.perez@empresa.cl / trabajador123
```

## Si necesitas automatizar todo
Alternativamente, puedes:
1. Instalar Supabase CLI: `brew install supabase/tap/supabase`
2. Conectarte: `supabase link --project-ref kttbmxpmvmsakxfbelen`
3. Aplicar migraciones: `supabase db push`

---

**¿Necesitas ayuda con algún paso?** Avísame y te guío.
