# LiLi CRM

CRM comercial interno para LiLi (prospección de retailers y aseguradoras, pipeline, leads, empresas, actividades y tareas), construido con Next.js.

## Estado actual — Fase 1 a 5 completadas

- [x] Setup Next.js (App Router) + TypeScript + Tailwind CSS v4
- [x] Identidad visual LiLi (morado #714DBF / #5A2EA6, fondo #EAECF6, Poppins)
- [x] Sidebar responsive (fijo en desktop, drawer en mobile) + Topbar
- [x] Navegación a las 8 secciones: Dashboard, Pipeline, Leads, Empresas, Tareas, Actividades, LiLi AI, Configuración
- [x] Tipos TypeScript (`Lead`, `Company`, `Activity`, `Task`, `User`) según el esquema de Google Sheets objetivo
- [x] Dashboard con KPIs, tareas de hoy, resumen de pipeline y actividad reciente
- [x] Sección LiLi AI visible con las 5 funcionalidades marcadas "Próximamente" — sin ninguna llamada a IA
- [x] Tabla de Leads: búsqueda, filtros (país/estado/tipo cliente), orden por columna, crear/editar/eliminar
- [x] Detalle de Lead: info principal, info comercial, seguimiento, historial (timeline), registrar actividad, crear tarea, cambiar estado — con las 3 acciones de IA visibles y deshabilitadas
- [x] Pipeline: Kanban con las 10 columnas de estado, drag & drop, feedback "Guardando… / Guardado", actualización optimista
- [x] Empresas: listado con búsqueda, crear/editar/eliminar; detalle con info de la empresa, contactos (leads asociados), actividad reciente y oportunidades
- [x] Actividades: historial global con filtro por tipo (Email/WhatsApp/Llamada/Reunión/LinkedIn/Nota/Otro) y registro de nueva actividad eligiendo el lead
- [x] Toasts para crear/editar/eliminar lead o empresa, registrar actividad, crear tarea
- [ ] Vista de Tareas (Hoy / Vencidas / Próximas) — Fase 6
- [ ] Integración real con Google Sheets vía Apps Script — Fase 8

## Dónde viven los datos hoy (importante)

Todavía no hay integración con Google Sheets (eso es la Fase 8). Mientras tanto, los datos viven **en memoria del navegador**, en un store de React (`src/lib/store.tsx`) sembrado con datos de ejemplo (`src/lib/mock-data.ts`, con nombres reales de la planilla: Sodimac, Cencosud, Walmart, Southbridge). Esto significa:

- Crear, editar o eliminar un lead, registrar una actividad o crear una tarea **sí funciona** y se refleja al instante en Dashboard, Leads y el detalle del lead.
- Si recargas la página, los cambios se pierden (vuelve a los datos de ejemplo) — normal, hasta que conectemos Sheets en la Fase 8.

## Cómo instalar y correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige automáticamente a `/dashboard`).

## Variables de entorno

Copia `.env.local.example` a `.env.local`. Estas variables se usan recién desde la Fase 8, cuando se conecte Google Apps Script:

```bash
cp .env.local.example .env.local
```

```
GOOGLE_APPS_SCRIPT_URL=   # URL del Web App de Apps Script
CRM_SECRET=               # Secreto compartido, header x-crm-secret
```

Nunca se exponen al cliente: solo se leen desde `app/api/*` (Route Handlers), no desde componentes.

## Arquitectura objetivo

```
Usuario
  ↓
Next.js / React (este repo)
  ↓
Next.js API Routes (app/api/*)
  ↓
Google Apps Script (Web App)
  ↓
Google Sheets
```

El frontend nunca llama directamente a Apps Script ni manipula Google Sheets: todo pasa por las API Routes de Next.js, que son las únicas que conocen `GOOGLE_APPS_SCRIPT_URL` y `CRM_SECRET`.

## Estructura de carpetas

```
src/
├── app/
│   ├── dashboard/
│   ├── pipeline/
│   ├── leads/            (+ [id]/)
│   ├── companies/        (+ [id]/)
│   ├── activities/
│   ├── tasks/
│   ├── ai/
│   ├── settings/
│   └── api/               (se agrega en Fase 8)
├── components/
│   ├── layout/            (Sidebar, Topbar, PageHeader, nav)
│   ├── ui/                (StatusBadge, ScoreBadge, KpiCard, EmptyState)
│   └── dashboard/
├── lib/
│   ├── utils.ts
│   └── mock-data.ts       (se reemplaza por Fase 8)
└── types/                 (Lead, Company, Activity, Task, User)
```

## Cómo configurar Apps Script (Fase 8)

1. En el Google Sheets que actúa como base de datos, crear las hojas `LEADS`, `EMPRESAS`, `ACTIVIDADES`, `TAREAS`, `USUARIOS`, `CONFIG` con las columnas definidas en `src/types/`.
2. Crear un proyecto de Google Apps Script vinculado a esa planilla, con `doGet()` / `doPost()` manejando un parámetro `action` (getLeads, createLead, updateLead, etc.) y validando el header `x-crm-secret` contra `CRM_SECRET`.
3. Publicar como Web App (acceso: "cualquiera con el link" o restringido según política de LiLi) y copiar la URL a `GOOGLE_APPS_SCRIPT_URL`.
4. Implementar `app/api/leads/route.ts` (y equivalentes) como proxy hacia Apps Script, sin exponer la URL ni el secreto al cliente.

## Cómo desplegar en Vercel

1. Subir este repo a GitHub.
2. Importarlo en Vercel.
3. Configurar `GOOGLE_APPS_SCRIPT_URL` y `CRM_SECRET` como variables de entorno del proyecto en Vercel (no en el repo).
4. Deploy.

## Cómo se agrega Claude API más adelante

La sección `/ai` ya está construida visualmente con sus 5 tarjetas, todas deshabilitadas. Cuando corresponda activarla:

1. Crear `src/lib/ai.ts` con las funciones (`generateFollowUp`, `analyzeLead`, etc.) que llaman a la API de Claude.
2. Crear `app/api/ai/*` como Route Handlers que usan la API key de Anthropic solo server-side.
3. Habilitar los botones de `src/app/ai/page.tsx` y de `LeadDetail` (Fase 2), conectándolos a esos endpoints.

No implementar nada de esto antes de esa fase.
