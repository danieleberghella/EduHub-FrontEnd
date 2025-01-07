import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common/PasswordInput";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password field must contain at least 8 characters"),
});

type LogInFormValues = z.infer<typeof logInSchema>;

const initialValues = {
  email: "",
  password: "",
};

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<"generic" | "credentials" | null>(null);
  const { setAsLogged } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogInFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(logInSchema),
  });

  const submitHandler: SubmitHandler<LogInFormValues> = (data) => {
    setError(null);
    axios
      .post(`${API_URL}/login`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setError(null);
          setAsLogged(res.data.token);
        } else {
          setError(res.status === 401 ? "credentials" : "generic");
        }
      })
      .catch((err) => {
        setError(err.status === 401 ? "credentials" : "generic");
      });
  };

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center p-4",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-md bg-[#2a3c61] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl relative">

        <div className="p-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Welcome Back
            </h1>
            <p className="text-lg text-white/60">
              Login to your EduHub account
            </p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 block">
                Email
              </Label>
              <Input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Enter your email"
                className={cn(
                  "w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors",
                  errors.email && "outline outline-destructive"
                )}
              />
              {errors.email && (
                <span className="text-destructive">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="password" className="text-white/90 block">
                Password
              </Label>
              <PasswordInput
                {...register("password", { required: true })}
                id="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  "w-full px-4 py-3  bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors",
                  errors.password && "outline outline-destructive"
                )}
              />
              {errors.password && (
                <span className="text-destructive">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-2 py-2 mt-8 bg-[#4a9d9c] rounded-full text-white font-bold hover:bg-[#3a8b8a] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/signup"
                className="text-white hover:text-[#f5e6d8]"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/60">
              Back to{" "}
              <Link
                to="/"
                className="text-white hover:text-[#f5e6d8]"
              >
                Homepage
              </Link>
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>
                {error === "credentials" ? "Invalid credentials" : "Error during login"}
              </AlertTitle>
              <AlertDescription>
                {error === "credentials"
                  ? "The provided credentials are not correct."
                  : "The provided credentials are not correct."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
