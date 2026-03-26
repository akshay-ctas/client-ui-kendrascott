"use client";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),
});

type ErrorType = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorType>({});
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErros: Record<string, string> = {};
      result.error.issues.map((err) => {
        const field = err.path[0] as string;
        fieldErros[field] = err.message;
      });
      setErrors(fieldErros);

      return;
    }
    setErrors({});
    try {
      const res = await loginUser(formData);
      toast("Login successfully");
      login(res);

      router.push("/profile");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast(message);
    }
  };

  return (
    <div className="px-10">
      <form className="space-y-7 mt-7 " onSubmit={handleSubmit}>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 shadow-none"
            autoComplete="username"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-12 shadow-none"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="text-end">
          <Link
            className="underline hover:text-cyan-700"
            href={"/auth/forgot-password"}
          >
            Forgot Password?
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className=" bg-[#dcf2e1] rounded-full text-[#222] py-3.75 px-12.5 mt-2 hover:bg-gray-200 transition"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
