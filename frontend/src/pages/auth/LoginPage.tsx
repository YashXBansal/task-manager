import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";

// Validate locally matching our backend schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError("");
      const response = await authApi.login(data);
      setCredentials(response.data.user, response.data.accessToken);
      navigate("/");
    } catch (error: any) {
      setServerError(error.response?.data?.error || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
      {/* Subtle Background Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(110,231,183,0.03)_0,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-xl shadow-2xl relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-text-1 mb-2">System Access</h1>
          <p className="text-text-2 text-sm font-mono">
            Authenticate to enter mission control.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@demo.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          {serverError && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-sm font-mono">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
          >
            Initialize Session
          </Button>
        </form>
      </div>
    </div>
  );
}
