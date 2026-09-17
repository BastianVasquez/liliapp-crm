"use client";

import { useState } from "react";
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

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export function ActivityForm({ open, onOpenChange, lead }: ActivityFormProps) {
  const { addActivity } = useCrm();
  const { showToast } = useToast();

  const [tipo, setTipo] = useState<(typeof ACTIVITY_TYPES)[number]>("Nota");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descripcion.trim()) return;

    addActivity({
      activity_id: `ACT-${Date.now()}`,
      lead_id: lead.lead_id,
      empresa_id: lead.empresa_id,
      fecha: new Date(fecha).toISOString(),
      tipo,
      descripcion,
      resultado: resultado || undefined,
      responsable: lead.responsable,
      created_at: new Date().toISOString(),
    });
    showToast("Actividad registrada");
    setDescripcion("");
    setResultado("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar actividad" className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
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
