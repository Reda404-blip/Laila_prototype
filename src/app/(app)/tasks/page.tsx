import Link from "next/link";

import { taskPriorityLabels, taskStatusLabels, taskTypeLabels } from '@/lib/i18n/fr';

import {
  getTasks,
  getTaskSummary,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/mock/tasks";

const priorityStyles: Record<TaskPriority, string> = {
  Low: "bg-[#E7EEF7] text-[#2C6FA8]",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

const statusStyles: Record<TaskStatus, string> = {
  Open: "bg-danger-soft text-danger",
  "In progress": "bg-warning-soft text-warning",
  Blocked: "bg-[#F8E1D0] text-[#C96A1A]",
  Done: "bg-brand-soft text-brand-strong",
};

export default function TasksPage() {
  const tasks = getTasks();
  const summary = getTaskSummary();

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Taches
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Chaque alerte doit produire une action nommee avec responsable et echeance.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Les taches transforment les exceptions de risque et de controle en travail de remediation.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Discipline des taches</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            La file est reliee aux declarations et alertes sources pour la tracabilite.
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Total taches", value: summary.total.toString().padStart(2, "0") },
          { label: "Taches ouvertes", value: summary.open.toString().padStart(2, "0") },
          { label: "Taches bloquees", value: summary.blocked.toString().padStart(2, "0") },
          { label: "Alertes liees", value: summary.linkedAlerts.toString().padStart(2, "0") },
        ].map((card) => (
          <article
            key={card.label}
            className="kpi-card rounded-[28px] p-5"
          >
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="table-panel p-6">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              File des taches
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Suivi operationnel par declaration
            </h3>
          </div>
          <div className="soft-note rounded-[22px] px-4 py-3 text-sm text-muted">
            Ouvrir directement la declaration depuis la file.
          </div>
        </div>

        <div className="table-shell mt-6">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Tache</th>
                <th className="px-4 py-3 font-semibold">Responsable</th>
                <th className="px-4 py-3 font-semibold">Priorite</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {tasks.map((task) => (
                <tr key={task.id} className="align-top hover:bg-background/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{task.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {task.clientName} / {task.obligationLabel} / {task.periodLabel}
                    </p>
                    <p className="mt-2 text-sm text-muted">{task.note}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p className="font-semibold text-foreground">{task.assignee}</p>
                    <p className="mt-2">{taskTypeLabels[task.taskType]}</p>
                    <p className="mt-2">Echeance {task.dueDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${priorityStyles[task.priority]}`}
                    >
                      {taskPriorityLabels[task.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[task.status]}`}
                    >
                      {taskStatusLabels[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/declarations/${task.declarationId}`}
                      className="secondary-button px-4 py-2 text-sm font-semibold"
                    >
                      Ouvrir le dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}



