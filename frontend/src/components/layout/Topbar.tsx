import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/Button";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear(); // <-- 3. Nuke the cache!
    logout();
  };

  return (
    <header className="h-16 shrink-0 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="text-text-2 text-sm font-mono flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Connection Secured
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-display text-text-1">
              {user?.name}
            </span>
            <span className="text-xs font-mono text-text-3">{user?.role}</span>
          </div>
          <div
            className="h-9 w-9 rounded-md flex items-center justify-center text-sm font-bold shadow-inner"
            style={{ backgroundColor: user?.avatarColor, color: "#000" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="w-px h-6 bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-text-2 hover:text-danger hover:bg-danger/10"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}
