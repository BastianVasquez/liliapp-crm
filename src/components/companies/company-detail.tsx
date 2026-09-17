"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Users2, Pencil, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CompanyForm } from "@/components/companies/company-form";
import { useCrm } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function CompanyDetail({ empresaId }: { empresaId: string }) {
  const { companies, leads, activities } = useCrm();
  const company = companies.find((c) => c.empresa_id === empresaId);
  const [editOpen, setEditOpen] = useState(false);

  if (!company) {
    return (
      <div>
        <Link href="/companies" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver a Empresas
        </Link>
        <div className="mt-6">
          <EmptyState
            icon={Building2}
            title="No encontramos esta empresa"
            description={`No existe (o fue eliminada) una empresa con id ${empresaId}.`}
          />
        </div>
      </div>
    );
  }

  const contacts = leads.filter((l) => l.empresa_id === company.empresa_id);
  const companyActivities = activities
    .filter((a) => a.empresa_id === company.empresa_id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div>
      <Link href="/companies" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a Empresas
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{company.empresa}</h1>
          <p className="text-sm text-muted">
            {company.industria || "Sin industria"} · {company.pais}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Empresa</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="País" value={company.pais} />
              <Field label="Industria" value={company.industria || "—"} />
              <Field label="Tipo de cliente" value={company.tipo_cliente} />
              <Field label="Potencial" value={company.potencial} />
              <Field
                icon={Globe}
                label="Website"
                value={company.website || "—"}
              />
              <Field label="N° empleados" value={company.numero_empleados ? String(company.numero_empleados) : "—"} />
              <Field label="Responsable" value={company.responsable} />
            </dl>
            {company.notas && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs text-muted">Notas</p>
                <p className="mt-1 text-sm text-foreground">{company.notas}</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Users2 className="h-4 w-4" /> Contactos
            </h2>
            {contacts.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Todavía no hay contactos asociados a esta empresa.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {contacts.map((lead) => (
                  <li key={lead.lead_id} className="flex items-center justify-between py-3">
                    <div>
                      <Link href={`/leads/${lead.lead_id}`} className="text-sm font-medium text-foreground hover:underline">
                        {lead.nombre}
                      </Link>
                      <p className="text-xs text-muted">
                        {lead.cargo || "—"} · {lead.email}
                      </p>
                    </div>
                    <StatusBadge status={lead.estado} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Actividad reciente</h2>
            {companyActivities.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Todavía no hay actividad registrada.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {companyActivities.slice(0, 8).map((activity) => (
                  <li key={activity.activity_id} className="text-sm">
                    <p className="text-foreground">{activity.descripcion}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {activity.tipo} · {activity.responsable} · {formatDate(activity.fecha)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">Oportunidades</h2>
            {contacts.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Sin oportunidades abiertas.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {contacts.map((lead) => (
                  <li key={lead.lead_id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/leads/${lead.lead_id}`} className="text-sm text-foreground hover:underline">
                        {lead.nombre}
                      </Link>
                      <div className="mt-1">
                        <StatusBadge status={lead.estado} />
                      </div>
                    </div>
                    <ScoreBadge score={lead.scoring} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <CompanyForm open={editOpen} onOpenChange={setEditOpen} company={company} />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
