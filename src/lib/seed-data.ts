import type { Lead } from "@/types/lead";
import type { Company } from "@/types/company";
import rawLeads from "@/lib/data/seed-leads.json";
import rawCompanies from "@/lib/data/seed-companies.json";

// Datos reales migrados desde Plantilla_SDR_LiLi.xlsx (Chile, México, Argentina, Perú, Colombia).
// Reemplaza el dataset de demo (mock-data.ts) como semilla inicial mientras no está
// conectado Google Sheets (Fase 8). Algunos campos que no existían en la planilla
// (scoring, tipo_cliente, fuente, estado) se completaron con valores por defecto o
// se infirieron desde texto libre — revisar y corregir a mano lo que corresponda.
export const seedLeads = rawLeads as unknown as Lead[];
export const seedCompanies = rawCompanies as unknown as Company[];
