import type { ClientType, Country } from "./lead";

export const POTENTIAL_LEVELS = ["Alto", "Medio", "Bajo"] as const;
export type PotentialLevel = (typeof POTENTIAL_LEVELS)[number];

export interface Company {
  empresa_id: string;
  empresa: string;
  pais: Country;
  industria: string;
  tipo_cliente: ClientType;
  website?: string;
  numero_empleados?: number;
  potencial: PotentialLevel;
  responsable: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}
