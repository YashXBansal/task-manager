import { useState } from "react";
import { ArrowUpDown, Clock } from "lucide-react";
import { useMyTasks, useUpdateMyTaskStatus } from "../hooks/useTasks";
import type { TaskStatus } from "../types"; // 🔥 Removed unused 'Task' import

type SortKey = "title" | "priority" | "dueDate" | "status";

export default function TasksPage() {
  const { data: tasks, isLoading } = useMyTasks();
  const { mutate: updateStatus } = useUpdateMyTaskStatus();

  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    // 🔥 Separated the date sorting logic from the string sorting logic
    if (sortKey === "dueDate") {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (aTime < bTime) return sortDir === "asc" ? -1 : 1;
      if (aTime > bTime) return sortDir === "asc" ? 1 : -1;
      return 0;
    }

    // Safely cast other fields to strings for comparison
    const aVal = String(a[sortKey] || "");
    const bVal = String(b[sortKey] || "");

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  if (isLoading)
    return (
      <div className="animate-pulse h-96 bg-surface border border-border rounded-xl" />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-text-1">My Tasks</h1>
        <p className="text-sm font-mono text-text-2 mt-1">
          Global view of your assigned priorities.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono text-text-2">
            <thead className="bg-elevated border-b border-border text-text-1 uppercase text-xs">
              <tr>
                {["Title", "Project", "Priority", "Due Date", "Status"].map(
                  (col) => {
                    const key = col.toLowerCase().replace(" ", "") as SortKey;
                    return (
                      <th
                        key={col}
                        className={`p-4 font-medium ${col !== "Project" ? "cursor-pointer hover:bg-base/50 transition-colors" : ""}`}
                        onClick={() => col !== "Project" && handleSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          {col}
                          {col !== "Project" && (
                            <ArrowUpDown size={14} className="text-text-3" />
                          )}
                        </div>
                      </th>
                    );
                  },
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {sortedTasks.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  task.status !== "DONE";

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-elevated/50 transition-colors ${isOverdue ? "border-l-2 border-l-warn bg-warn/5" : ""}`}
                  >
                    <td className="p-4 font-display text-text-1">
                      {task.title}
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded bg-elevated border border-border text-xs"
                        style={{ color: task.project?.color }}
                      >
                        {task.project?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          task.priority === "HIGH"
                            ? "bg-danger/10 text-danger border border-danger/20"
                            : task.priority === "MEDIUM"
                              ? "bg-warn/10 text-warn border border-warn/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td
                      className={`p-4 flex items-center gap-2 ${isOverdue ? "text-warn font-bold" : ""}`}
                    >
                      <Clock size={14} />
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "None"}
                    </td>
                    <td className="p-4">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus({
                            taskId: task.id,
                            status: e.target.value as TaskStatus,
                          })
                        }
                        className="bg-base border border-border text-text-1 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}

              {sortedTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-text-3 border-dashed"
                  >
                    No tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
