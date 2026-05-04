import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useCreateTask } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { useAuthStore } from "../../store/auth.store";
import type { TaskStatus } from "../../types";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assignedToId: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const TaskForm = ({
  projectId,
  initialStatus,
  onSuccess,
}: {
  projectId: string;
  initialStatus: TaskStatus;
  onSuccess: () => void;
}) => {
  const { mutate, isPending } = useCreateTask(projectId);
  const { data: users } = useUsers();
  const currentUser = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "MEDIUM", assignedToId: currentUser?.id }, // Auto-assign to self by default
  });

  const onSubmit = (data: FormValues) => {
    // Format data for backend
    const payload = {
      ...data,
      assignedToId: data.assignedToId || null,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      status: initialStatus,
    };
    mutate(payload, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="e.g. Update Dockerfile"
        {...register("title")}
        error={errors.title?.message}
      />
      <Input
        label="Description (Optional)"
        placeholder="Brief details..."
        {...register("description")}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-2 mb-1.5 font-display">
            Priority
          </label>
          <select
            {...register("priority")}
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-2 mb-1.5 font-display">
            Assign To
          </label>
          <select
            {...register("assignedToId")}
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="">Unassigned</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input label="Due Date" type="datetime-local" {...register("dueDate")} />

      <div className="pt-4 flex justify-end">
        <Button type="submit" loading={isPending}>
          Dispatch Task
        </Button>
      </div>
    </form>
  );
};
