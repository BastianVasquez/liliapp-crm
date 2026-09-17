"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Lead } from "@/types/lead";
import type { Company } from "@/types/company";
import type { Task } from "@/types/task";
import type { Activity } from "@/types/activity";
import { mockLeads, mockCompanies, mockTasks, mockActivities } from "@/lib/mock-data";

interface CrmState {
  leads: Lead[];
  companies: Company[];
  tasks: Task[];
  activities: Activity[];
}

interface CrmActions {
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, patch: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  addTask: (task: Task) => void;
  completeTask: (taskId: string) => void;
  addActivity: (activity: Activity) => void;
}

type CrmContextValue = CrmState & CrmActions;

const CrmContext = createContext<CrmContextValue | null>(null);

function nextLeadId(leads: Lead[]) {
  const max = leads.reduce((acc, lead) => {
    const n = Number(lead.lead_id.replace("LILI-", ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `LILI-${String(max + 1).padStart(4, "0")}`;
}

export function CrmDataProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [companies] = useState<Company[]>(mockCompanies);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => [{ ...lead, lead_id: lead.lead_id || nextLeadId(prev) }, ...prev]);
  }, []);

  const updateLead = useCallback((leadId: string, patch: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.lead_id === leadId
          ? { ...lead, ...patch, updated_at: new Date().toISOString() }
          : lead
      )
    );
  }, []);

  const deleteLead = useCallback((leadId: string) => {
    setLeads((prev) => prev.filter((lead) => lead.lead_id !== leadId));
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.task_id === taskId
          ? { ...task, estado: "Completada", completed_at: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const addActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
    setLeads((prev) =>
      prev.map((lead) =>
        lead.lead_id === activity.lead_id
          ? { ...lead, ultimo_contacto: activity.fecha }
          : lead
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      leads,
      companies,
      tasks,
      activities,
      addLead,
      updateLead,
      deleteLead,
      addTask,
      completeTask,
      addActivity,
    }),
    [leads, companies, tasks, activities, addLead, updateLead, deleteLead, addTask, completeTask, addActivity]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm debe usarse dentro de <CrmDataProvider>");
  return ctx;
}
