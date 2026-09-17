import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Building2,
  CheckSquare,
  ListTodo,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/companies", label: "Empresas", icon: Building2 },
  { href: "/tasks", label: "Tareas", icon: CheckSquare },
  { href: "/activities", label: "Actividades", icon: ListTodo },
  { href: "/ai", label: "LiLi AI", icon: Sparkles },
  { href: "/settings", label: "Configuración", icon: Settings },
];
