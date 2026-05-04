import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Terminal,
} from "lucide-react";
import { clsx } from "clsx";

export default function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: CheckSquare, label: "My Tasks", path: "/tasks" },
  ];

  return (
    <aside className="group w-[64px] hover:w-[240px] shrink-0 h-full bg-surface border-r border-border transition-[width] duration-300 ease-in-out flex flex-col z-20 relative">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-border overflow-hidden whitespace-nowrap">
        <Terminal className="min-w-[24px] text-primary" size={24} />
        <span className="ml-4 font-display font-bold text-text-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          SYS_COMMAND
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-hidden whitespace-nowrap">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center h-10 px-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-2 hover:bg-elevated hover:text-text-1",
              )
            }
          >
            <item.icon className="min-w-[20px]" size={20} />
            <span className="ml-4 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
