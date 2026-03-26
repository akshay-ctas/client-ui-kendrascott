"use client";
import { z } from "zod";
import { useState } from "react";
import { registerUser, sendOtpEmailVerify } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .min(2, "First name must be at least 2 characters."),

  lastName: z
    .string()
    .min(1, "Last name is required.")
    .min(2, "Last name must be at least 2 characters."),

  zipCode: z
    .string()
    .min(1, "Zip code is required.")
    .regex(/^[0-9]{6}$/, "Zip code must be 6 digits"),

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
  zipCode?: string;
  lastName?: string;
  firstName?: string;
};

const initialValue = {
  email: "",
  password: "",
  zipCode: "",
  lastName: "",
  firstName: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialValue);
  const [errors, setErrors] = useState<ErrorType>({});
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
      const res = await registerUser(formData);
      toast("Registration Complete!", {
        description: `Check ${res.data.email} for your verification code to continue.`,
      });
      if (res.status === "success" && res.data) {
        router.push(`/auth/send-to-email?email=${res.data.email}`);
        await sendOtpEmailVerify({ email: res.data.email });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast(message);
    }
  };

  return (
    <div className="px-10">
      <form className="space-y-7 mt-7 " onSubmit={handleSubmit}>
        <p>
          Sign up for Insider benefits like a birthday gift, early access to
          product launches and promotions, and standard shipping offers.
          Insiders are also eligible to sign up for Club Kendra—our VIP
          membership service!
        </p>
        <h1>All fields required</h1>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 shadow-none"
            autoComplete="email"
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
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="h-12  w-full shadow-none"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="w-1/2">
            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="h-12 w-full shadow-none"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div>
          <Input
            type="text"
            name="zipCode"
            placeholder="ZIP Code"
            value={formData.zipCode}
            onChange={handleChange}
            className="h-12 shadow-none"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-5">
          By clicking Create Account, you agree to the{" "}
          <span className="underline cursor-pointer">Terms & Conditions</span>,
          and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className=" bg-[#dcf2e1] rounded-full text-[#222] py-3.75 px-12.5 mt-2 hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
