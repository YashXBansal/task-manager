import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Modal } from "../ui/Modal";
import { TaskForm } from "./TaskForm";
import { useProjectTasks, useUpdateTaskStatus } from "../../hooks/useTasks";
import type { TaskStatus } from "../../types";
import { useAuthStore } from "../../store/auth.store";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Completed" },
];

export const TaskBoard = ({ projectId }: { projectId: string }) => {
  const user = useAuthStore((state) => state.user);
  const { data: tasks, isLoading } = useProjectTasks(projectId);
  const { mutate: updateStatus } = useUpdateTaskStatus(projectId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<TaskStatus>("TODO");
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) updateStatus({ taskId, status });
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(status);
  };

  const openNewTaskModal = (status: TaskStatus) => {
    setActiveColumn(status);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="h-96 flex items-center justify-center font-mono text-text-3">
        Loading board geometry...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
      {COLUMNS.map((col) => {
        const columnTasks = tasks?.filter((t) => t.status === col.id) || [];

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col bg-surface/50 border rounded-xl overflow-hidden transition-colors ${dragOverCol === col.id ? "border-primary shadow-[0_0_15px_rgba(110,231,183,0.1)]" : "border-border"}`}
          >
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-text-1 text-sm">
                  {col.label}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-elevated text-xs font-mono text-text-2">
                  {columnTasks.length}
                </span>
              </div>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => openNewTaskModal(col.id)}
                  className="text-text-3 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {columnTasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-text-3 text-xs font-mono">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Initialize Task: ${activeColumn}`}
      >
        <TaskForm
          projectId={projectId}
          initialStatus={activeColumn}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
