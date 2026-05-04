import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios.instance";
import { useUsers } from "../../hooks/useUsers";
import { Button } from "../ui/Button";
import type { Project } from "../../types";

export const ManageTeamModal = ({ project }: { project: Project }) => {
  const qc = useQueryClient();
  const { data: users } = useUsers();
  const [selectedUser, setSelectedUser] = useState("");

  const { mutate: addMember, isPending } = useMutation({
    mutationFn: () =>
      api.post(`/projects/${project.id}/members`, {
        userId: selectedUser,
        role: "MEMBER",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", project.id] });
      setSelectedUser("");
    },
  });

  // Filter out users who are already in the project
  const availableUsers = users?.filter(
    (u) => !project.members?.some((m) => m.userId === u.id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-display text-text-2 mb-3">Add Teammate</h3>
        <div className="flex gap-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex h-10 flex-1 rounded-md border border-border bg-base px-3 py-2 text-sm text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="" disabled>
              Select a user...
            </option>
            {availableUsers?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <Button
            onClick={() => addMember()}
            disabled={!selectedUser}
            loading={isPending}
          >
            Add
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-display text-text-2 mb-3">
          Current Roster
        </h3>
        <div className="space-y-2 border border-border rounded-md p-2 bg-base">
          {project.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-black"
                  style={{ backgroundColor: member.user?.avatarColor }}
                >
                  {member.user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-mono text-text-1">
                    {member.user?.name}
                  </p>
                  <p className="text-xs text-text-3">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
