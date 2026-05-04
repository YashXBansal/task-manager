import { useState } from "react";
import { Plus } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuthStore } from "../store/auth.store";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProjectForm } from "../components/project/ProjectForm";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-text-1">Projects Hub</h1>
          <p className="text-sm font-mono text-text-2 mt-1">
            Manage active deployments and teams.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={<Plus size={18} />}
          >
            New Project
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-surface border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-surface/50">
          <p className="text-text-2 font-mono">No active projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Project"
      >
        <ProjectForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
