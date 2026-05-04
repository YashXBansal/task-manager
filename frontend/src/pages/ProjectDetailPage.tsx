import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { api } from "../api/axios.instance";
import { TaskBoard } from "../components/task/TaskBoard";
import { Modal } from "../components/ui/Modal";
import { ManageTeamModal } from "../components/project/ManageTeamModal";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/auth.store";
import type { ApiResponse, Project } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return <div className="animate-pulse h-8 w-64 bg-surface rounded" />;
  if (!project)
    return (
      <div className="text-danger font-mono">
        Project access denied or not found.
      </div>
    );

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/projects"
            className="text-text-3 hover:text-text-1 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-2xl font-display text-text-1">
              {project.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-2">
            {project.members?.map((member, i) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full border-2 border-base flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: member.user?.avatarColor,
                  color: "#000",
                  zIndex: 10 - i,
                }}
                title={member.user?.name}
              >
                {member.user?.name.charAt(0)}
              </div>
            ))}
          </div>
          {user?.role === "ADMIN" && (
            <Button
                variant="secondary"
              icon={<Users size={16} />}
              onClick={() => setIsTeamModalOpen(true)}
            >
              Manage Team
            </Button>
          )}
        </div>
      </div>

      {/* The Kanban Board */}
      <div className="flex-1">
        <TaskBoard projectId={project.id} />
      </div>

      {/* The Team Management Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Team Configuration"
      >
        <ManageTeamModal project={project} />
      </Modal>
    </div>
  );
}
