"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCrm } from "@/lib/store";
import { useToast } from "@/components/providers/toast-provider";
import { TASK_PRIORITIES } from "@/types/task";
import type { Lead } from "@/types/lead";

const RESPONSABLES = ["Bastián", "Alejandro"];

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

export function TaskForm({ open, onOpenChange, lead: fixedLead }: TaskFormProps) {
  const { leads, addTask } = useCrm();
  const { showToast } = useToast();

  const [selectedLeadId, setSelectedLeadId] = useState(fixedLead?.lead_id ?? "");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [prioridad, setPrioridad] = useState<(typeof TASK_PRIORITIES)[number]>("Media");
  const [responsable, setResponsable] = useState(fixedLead?.responsable ?? RESPONSABLES[0]);

  const lead = fixedLead ?? leads.find((l) => l.lead_id === selectedLeadId);

  const leadOptions = useMemo(
    () => leads.map((l) => ({ id: l.lead_id, label: `${l.nombre} — ${l.empresa}` })),
    [leads]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;

    addTask({
      task_id: `TASK-${Date.now()}`,
      lead_id: lead?.lead_id,
      empresa_id: lead?.empresa_id,
      titulo,
      descripcion: descripcion || undefined,
      fecha_vencimiento: new Date(fechaVencimiento).toISOString(),
      prioridad,
      estado: "Pendiente",
      responsable,
      created_at: new Date().toISOString(),
    });
    showToast("Tarea creada");
    setTitulo("");
    setDescripcion("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Crear tarea" className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="task-titulo">Título</Label>
            <Input id="task-titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="task-desc">Descripción</Label>
            <Textarea
              id="task-desc"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {fixedLead ? (
            <div>
              <Label>Lead</Label>
              <p className="text-sm text-foreground">
                {fixedLead.nombre} — {fixedLead.empresa}
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="task-lead">Lead (opcional)</Label>
              <Select id="task-lead" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}>
                <option value="">Sin lead asociado</option>
                {leadOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-fecha">Fecha de vencimiento</Label>
              <Input
                id="task-fecha"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="task-prioridad">Prioridad</Label>
              <Select
                id="task-prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as typeof prioridad)}
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="task-responsable">Responsable</Label>
            <Select id="task-responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
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
              Crear tarea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
