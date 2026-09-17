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
import { COUNTRIES, CLIENT_TYPES } from "@/types/lead";
import { POTENTIAL_LEVELS, type Company } from "@/types/company";

const RESPONSABLES = ["Bastián", "Alejandro"];

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company;
}

const emptyForm = {
  empresa: "",
  pais: "Chile" as (typeof COUNTRIES)[number],
  industria: "",
  tipo_cliente: "Retail" as (typeof CLIENT_TYPES)[number],
  website: "",
  numero_empleados: "",
  potencial: "Medio" as (typeof POTENTIAL_LEVELS)[number],
  responsable: RESPONSABLES[0],
  notas: "",
};

export function CompanyForm({ open, onOpenChange, company }: CompanyFormProps) {
  const { addCompany, updateCompany } = useCrm();
  const { showToast } = useToast();
  const isEdit = Boolean(company);

  const [form, setForm] = useState(() =>
    company
      ? {
          empresa: company.empresa,
          pais: company.pais,
          industria: company.industria,
          tipo_cliente: company.tipo_cliente,
          website: company.website ?? "",
          numero_empleados: company.numero_empleados ? String(company.numero_empleados) : "",
          potencial: company.potencial,
          responsable: company.responsable,
          notas: company.notas ?? "",
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.empresa.trim()) {
      setError("El nombre de la empresa es obligatorio");
      return;
    }
    setError(null);

    const now = new Date().toISOString();
    if (isEdit && company) {
      updateCompany(company.empresa_id, {
        ...form,
        numero_empleados: form.numero_empleados ? Number(form.numero_empleados) : undefined,
      });
      showToast("Empresa actualizada");
    } else {
      addCompany({
        empresa_id: "",
        ...form,
        numero_empleados: form.numero_empleados ? Number(form.numero_empleados) : undefined,
        created_at: now,
        updated_at: now,
      });
      showToast("Empresa creada");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={isEdit ? "Editar empresa" : "Crear empresa"} className="max-w-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input id="empresa" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
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
            <Label htmlFor="industria">Industria</Label>
            <Input
              id="industria"
              value={form.industria}
              onChange={(e) => update("industria", e.target.value)}
              placeholder="Retail, Seguros, Asistencia Hogar…"
            />
          </div>

          <div>
            <Label htmlFor="tipo_cliente">Tipo de cliente</Label>
            <Select
              id="tipo_cliente"
              value={form.tipo_cliente}
              onChange={(e) => update("tipo_cliente", e.target.value as typeof form.tipo_cliente)}
            >
              {CLIENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="potencial">Potencial</Label>
            <Select
              id="potencial"
              value={form.potencial}
              onChange={(e) => update("potencial", e.target.value as typeof form.potencial)}
            >
              {POTENTIAL_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={form.website} onChange={(e) => update("website", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="numero_empleados">N° empleados</Label>
            <Input
              id="numero_empleados"
              inputMode="numeric"
              value={form.numero_empleados}
              onChange={(e) => update("numero_empleados", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
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

          <div className="sm:col-span-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea id="notas" rows={3} value={form.notas} onChange={(e) => update("notas", e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              {isEdit ? "Guardar cambios" : "Crear empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
