export const LEAD_STATUSES = [
  "Nuevo",
  "Contactado",
  "Respondió",
  "Reunión",
  "Propuesta",
  "Piloto",
  "Negociación",
  "Ganado",
  "Perdido",
  "En pausa",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CLIENT_TYPES = ["Retail", "Seguros", "Enterprise", "Otro"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const LEAD_SOURCES = [
  "LinkedIn",
  "Referido",
  "Evento",
  "Web",
  "Outbound",
  "Otro",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const COUNTRIES = ["Chile", "México", "Argentina", "Perú", "Colombia"] as const;
export type Country = (typeof COUNTRIES)[number];

export interface Lead {
  lead_id: string;
  nombre: string;
  empresa_id: string;
  empresa: string;
  cargo: string;
  email: string;
  telefono?: string;
  linkedin?: string;
  pais: Country;
  tipo_cliente: ClientType;
  fuente: LeadSource;
  scoring: number;
  estado: LeadStatus;
  responsable: string;
  dolor_detectado?: string;
  solucion_propuesta?: string;
  ultimo_contacto?: string;
  proximo_contacto?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}
