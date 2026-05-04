import { Clock } from "lucide-react";
import type { Task } from "../../types";

const priorityColors = {
  LOW: "border-l-primary",
  MEDIUM: "border-l-warn",
  HIGH: "border-l-danger",
};

export const TaskCard = ({ task }: { task: Task }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-base border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-text-3 transition-colors border-l-4 ${priorityColors[task.priority]} animate-fade-up`}
    >
      <h4 className="font-display text-text-1 text-sm mb-2">{task.title}</h4>

      {task.description && (
        <p className="text-xs font-mono text-text-3 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center text-xs font-mono text-text-3 gap-1">
          {task.dueDate ? (
            <>
              <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
            </>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border">
              No Due Date
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-inner"
            style={{
              backgroundColor: task.assignedTo.avatarColor || "#6ee7b7",
              color: "#000",
            }}
            title={task.assignedTo.name}
          >
            {task.assignedTo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};
