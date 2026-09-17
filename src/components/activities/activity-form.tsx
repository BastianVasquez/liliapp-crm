"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import { ACTIVITY_TYPES } from "@/types/activity";
import type { Lead } from "@/types/lead";

const RESPONSABLES = ["Bastián", "Alejandro"];

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si se pasa, el lead queda fijo (ej. desde el detalle de un lead). Si no, se puede elegir. */
  lead?: Lead;
}

export function ActivityForm({ open, onOpenChange, lead: fixedLead }: ActivityFormProps) {
  const { leads, addActivity } = useCrm();
  const { showToast } = useToast();

  const [selectedLeadId, setSelectedLeadId] = useState(fixedLead?.lead_id ?? leads[0]?.lead_id ?? "");
  const [tipo, setTipo] = useState<(typeof ACTIVITY_TYPES)[number]>("Nota");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState("");
  const [responsable, setResponsable] = useState(fixedLead?.responsable ?? RESPONSABLES[0]);

  const lead = fixedLead ?? leads.find((l) => l.lead_id === selectedLeadId);

  const leadOptions = useMemo(
    () => leads.map((l) => ({ id: l.lead_id, label: `${l.nombre} — ${l.empresa}` })),
    [leads]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descripcion.trim() || !lead) return;

    addActivity({
      activity_id: `ACT-${Date.now()}`,
      lead_id: lead.lead_id,
      empresa_id: lead.empresa_id,
      fecha: new Date(fecha).toISOString(),
      tipo,
      descripcion,
      resultado: resultado || undefined,
      responsable,
      created_at: new Date().toISOString(),
    });
    showToast("Actividad registrada");
    setDescripcion("");
    setResultado("");
    onOpenChange(false);
  }

  if (leads.length === 0 && !fixedLead) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent title="Registrar actividad" className="max-w-md">
          <p className="text-sm text-muted">
            Todavía no hay leads creados. Crea un lead primero para poder registrar actividad.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar actividad" className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fixedLead ? (
            <div>
              <Label>Lead</Label>
              <p className="text-sm text-foreground">
                {fixedLead.nombre} — {fixedLead.empresa}
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="act-lead">Lead</Label>
              <Select id="act-lead" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}>
                {leadOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {lead && <p className="text-xs text-muted">Empresa: {lead.empresa}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="act-tipo">Tipo</Label>
              <Select
                id="act-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as typeof tipo)}
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="act-fecha">Fecha</Label>
              <Input id="act-fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="act-desc">Descripción</Label>
            <Textarea
              id="act-desc"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="act-resultado">Resultado</Label>
            <Input id="act-resultado" value={resultado} onChange={(e) => setResultado(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="act-responsable">Responsable</Label>
            <Select id="act-responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
              {RESPONSABLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
