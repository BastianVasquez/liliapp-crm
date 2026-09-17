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
import { TASK_PRIORITIES } from "@/types/task";
import type { Lead } from "@/types/lead";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

export function TaskForm({ open, onOpenChange, lead }: TaskFormProps) {
  const { addTask } = useCrm();
  const { showToast } = useToast();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [prioridad, setPrioridad] = useState<(typeof TASK_PRIORITIES)[number]>("Media");

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
      responsable: lead?.responsable ?? "Bastián",
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
