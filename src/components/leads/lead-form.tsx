"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import {
  LEAD_STATUSES,
  CLIENT_TYPES,
  LEAD_SOURCES,
  COUNTRIES,
  type Lead,
} from "@/types/lead";

const RESPONSABLES = ["Bastián", "Alejandro"];

interface LeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

const emptyForm = {
  nombre: "",
  empresa: "",
  cargo: "",
  email: "",
  telefono: "",
  linkedin: "",
  pais: "Chile" as (typeof COUNTRIES)[number],
  tipo_cliente: "Retail" as (typeof CLIENT_TYPES)[number],
  fuente: "LinkedIn" as (typeof LEAD_SOURCES)[number],
  scoring: "",
  estado: "Nuevo" as (typeof LEAD_STATUSES)[number],
  responsable: RESPONSABLES[0],
  dolor_detectado: "",
  solucion_propuesta: "",
  ultimo_contacto: "",
  proximo_contacto: "",
  notas: "",
};

export function LeadForm({ open, onOpenChange, lead }: LeadFormProps) {
  const { companies, addCompany, addLead, updateLead } = useCrm();
  const { showToast } = useToast();
  const isEdit = Boolean(lead);

  const [form, setForm] = useState(() =>
    lead
      ? {
          nombre: lead.nombre,
          empresa: lead.empresa,
          cargo: lead.cargo,
          email: lead.email,
          telefono: lead.telefono ?? "",
          linkedin: lead.linkedin ?? "",
          pais: lead.pais,
          tipo_cliente: lead.tipo_cliente,
          fuente: lead.fuente,
          scoring: String(lead.scoring ?? ""),
          estado: lead.estado,
          responsable: lead.responsable,
          dolor_detectado: lead.dolor_detectado ?? "",
          solucion_propuesta: lead.solucion_propuesta ?? "",
          ultimo_contacto: lead.ultimo_contacto?.slice(0, 10) ?? "",
          proximo_contacto: lead.proximo_contacto?.slice(0, 10) ?? "",
          notas: lead.notas ?? "",
        }
      : emptyForm
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.nombre.trim()) next.nombre = "Requerido";
    if (!form.empresa.trim()) next.empresa = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email inválido";
    if (form.scoring && Number.isNaN(Number(form.scoring))) next.scoring = "Debe ser número";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    if (isEdit && lead) {
      updateLead(lead.lead_id, {
        ...form,
        scoring: Number(form.scoring) || 0,
        ultimo_contacto: form.ultimo_contacto || undefined,
        proximo_contacto: form.proximo_contacto || undefined,
      });
      showToast("Lead actualizado");
    } else {
      const existingCompany = companies.find(
        (c) => c.empresa.trim().toLowerCase() === form.empresa.trim().toLowerCase()
      );
      let empresaId = existingCompany?.empresa_id;
      if (!empresaId) {
        empresaId = `EMP-${Date.now()}`;
        addCompany({
          empresa_id: empresaId,
          empresa: form.empresa,
          pais: form.pais,
          industria: "",
          tipo_cliente: form.tipo_cliente,
          potencial: "Medio",
          responsable: form.responsable,
          created_at: now,
          updated_at: now,
        });
      }
      addLead({
        lead_id: "",
        empresa_id: empresaId,
        ...form,
        scoring: Number(form.scoring) || 0,
        ultimo_contacto: form.ultimo_contacto || undefined,
        proximo_contacto: form.proximo_contacto || undefined,
        created_at: now,
        updated_at: now,
      });
      showToast("Lead creado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={isEdit ? "Editar lead" : "Crear lead"} className="max-w-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
            />
            {errors.nombre && <p className="mt-1 text-xs text-danger">{errors.nombre}</p>}
          </div>

          <div>
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              value={form.empresa}
              onChange={(e) => update("empresa", e.target.value)}
            />
            {errors.empresa && <p className="mt-1 text-xs text-danger">{errors.empresa}</p>}
          </div>

          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" value={form.cargo} onChange={(e) => update("cargo", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => update("telefono", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="pais">País</Label>
            <Select id="pais" value={form.pais} onChange={(e) => update("pais", e.target.value as typeof form.pais)}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo_cliente">Tipo Cliente</Label>
            <Select
              id="tipo_cliente"
              value={form.tipo_cliente}
              onChange={(e) => update("tipo_cliente", e.target.value as typeof form.tipo_cliente)}
            >
              {CLIENT_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fuente">Fuente</Label>
            <Select
              id="fuente"
              value={form.fuente}
              onChange={(e) => update("fuente", e.target.value as typeof form.fuente)}
            >
              {LEAD_SOURCES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="scoring">Scoring</Label>
            <Input
              id="scoring"
              inputMode="numeric"
              value={form.scoring}
              onChange={(e) => update("scoring", e.target.value)}
            />
            {errors.scoring && <p className="mt-1 text-xs text-danger">{errors.scoring}</p>}
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              id="estado"
              value={form.estado}
              onChange={(e) => update("estado", e.target.value as typeof form.estado)}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="responsable">Responsable</Label>
            <Select
              id="responsable"
              value={form.responsable}
              onChange={(e) => update("responsable", e.target.value)}
            >
              {RESPONSABLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="ultimo_contacto">Último contacto</Label>
            <Input
              id="ultimo_contacto"
              type="date"
              value={form.ultimo_contacto}
              onChange={(e) => update("ultimo_contacto", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="proximo_contacto">Próximo contacto</Label>
            <Input
              id="proximo_contacto"
              type="date"
              value={form.proximo_contacto}
              onChange={(e) => update("proximo_contacto", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="dolor_detectado">Dolor detectado</Label>
            <Textarea
              id="dolor_detectado"
              rows={2}
              value={form.dolor_detectado}
              onChange={(e) => update("dolor_detectado", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="solucion_propuesta">Solución propuesta</Label>
            <Textarea
              id="solucion_propuesta"
              rows={2}
              value={form.solucion_propuesta}
              onChange={(e) => update("solucion_propuesta", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              rows={2}
              value={form.notas}
              onChange={(e) => update("notas", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              {isEdit ? "Guardar cambios" : "Crear lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
