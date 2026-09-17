export const ACTIVITY_TYPES = [
  "Email",
  "WhatsApp",
  "Llamada",
  "Reunión",
  "LinkedIn",
  "Nota",
  "Otro",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Activity {
  activity_id: string;
  lead_id: string;
  empresa_id: string;
  fecha: string;
  tipo: ActivityType;
  descripcion: string;
  resultado?: string;
  responsable: string;
  created_at: string;
}
