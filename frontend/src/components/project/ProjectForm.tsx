import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useCreateProject } from "../../hooks/useProjects";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color"),
  // 🔥 Removed .default() here to perfectly align the types!
});

type FormValues = z.infer<typeof schema>;

export const ProjectForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate, isPending } = useCreateProject();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // React Hook Form safely handles the default UI state instead
    defaultValues: { color: "#818cf8" },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data, { onSuccess: () => onSuccess() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Project Name"
        placeholder="e.g. Migration v2"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Description"
        placeholder="Brief overview..."
        {...register("description")}
        error={errors.description?.message}
      />

      <div>
        <label className="block text-sm font-medium text-text-2 mb-1.5 font-display">
          Theme Color
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            className="h-10 w-14 p-1 bg-surface border border-border rounded-md cursor-pointer"
            {...register("color")}
          />
          <Input
            className="flex-1"
            {...register("color")}
            error={errors.color?.message}
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" loading={isPending}>
          Initialize Project
        </Button>
      </div>
    </form>
  );
};
