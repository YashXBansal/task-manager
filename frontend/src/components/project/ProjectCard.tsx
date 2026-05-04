import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import type { Project } from "../../types";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block group bg-surface border border-border rounded-xl p-5 hover:border-text-3 transition-colors relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-80"
        style={{ backgroundColor: project.color }}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-elevated rounded-md group-hover:bg-base transition-colors">
            <FolderKanban size={20} style={{ color: project.color }} />
          </div>
          <h3 className="font-display font-semibold text-text-1 text-lg group-hover:text-primary transition-colors">
            {project.name}
          </h3>
        </div>
      </div>

      <p className="text-sm font-mono text-text-2 mb-6 line-clamp-2 min-h-10">
        {project.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-xs font-mono text-text-3">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            {project._count?.tasks || 0} Tasks
          </span>
        </div>

        {/* Overlapping Avatars */}
        <div className="flex -space-x-2">
          {project.members?.map((member, i) => (
            <div
              key={member.id}
              className="w-7 h-7 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: member.user?.avatarColor || "#6ee7b7",
                color: "#000",
                zIndex: 10 - i,
              }}
              title={member.user?.name}
            >
              {member.user?.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};
