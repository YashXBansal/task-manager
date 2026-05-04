import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, ListTodo, AlertOctagon } from "lucide-react";
import { api } from "../api/axios.instance";
import { useAuthStore } from "../store/auth.store";
import type { ApiResponse, Task } from "../types";

// const fetchDashboardStats = async () => {
//   const [myTasksRes, overdueRes] = await Promise.all([
//     api.get<ApiResponse<Task[]>>("/tasks/my"),
//     api.get<ApiResponse<Task[]>>("/tasks/overdue"),
//   ]);

//   const tasks = myTasksRes.data.data;
//   return {
//     total: tasks.length,
//     inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
//     done: tasks.filter((t) => t.status === "DONE").length,
//     overdue: overdueRes.data.data.length,
//   };
// };

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats", user?.id], // <-- Unique cache key
    queryFn: async () => {
      // 1. Fetch the user's personal tasks
      const myTasksRes = await api.get<ApiResponse<Task[]>>("/tasks/my");
      const tasks = myTasksRes.data.data;

      const overdueCount =
        user?.role === "ADMIN"
          ? (await api.get<ApiResponse<Task[]>>("/tasks/overdue")).data.data
              .length
          : tasks.filter(
              (t) =>
                t.dueDate &&
                new Date(t.dueDate) < new Date() &&
                t.status !== "DONE",
            ).length;

      return {
        total: tasks.length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        done: tasks.filter((t) => t.status === "DONE").length,
        overdue: overdueCount,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-text-1">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned"
          value={stats?.total}
          icon={<ListTodo className="text-secondary" />}
          loading={isLoading}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress}
          icon={<Clock className="text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Completed"
          value={stats?.done}
          icon={<CheckCircle2 className="text-text-3" />}
          loading={isLoading}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdue}
          icon={<AlertOctagon className="text-danger" />}
          loading={isLoading}
          isWarning={(stats?.overdue ?? 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 min-h-100">
          <h2 className="text-lg font-display text-text-1 mb-4">
            Active Priorities
          </h2>
          <div className="flex items-center justify-center h-75 text-text-3 font-mono text-sm border border-dashed border-border rounded-lg bg-base/50">
            [ Task Board Mount Point - Coming Soon ]
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 min-h-100">
          <h2 className="text-lg font-display text-text-1 mb-4">System Log</h2>
          <div className="flex items-center justify-center h-75 text-text-3 font-mono text-sm border border-dashed border-border rounded-lg bg-base/50">
            [ Activity Feed Mount Point ]
          </div>
        </div>
      </div>
    </div>
  );
}

// Strictly Typed Props
interface StatCardProps {
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading: boolean;
  isWarning?: boolean;
}

function StatCard({ title, value, icon, loading, isWarning }: StatCardProps) {
  return (
    <div
      className={`bg-surface border p-5 rounded-xl transition-all duration-300 ${
        isWarning
          ? "border-warn/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-mono text-text-2">{title}</p>
        <div className="p-2 bg-elevated rounded-md">{icon}</div>
      </div>
      <div className="text-3xl font-display text-text-1">
        {loading ? (
          <div className="h-9 w-12 bg-elevated animate-pulse rounded" />
        ) : (
          (value ?? 0)
        )}
      </div>
    </div>
  );
}
