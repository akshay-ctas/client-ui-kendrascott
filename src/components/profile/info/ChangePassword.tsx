"use client";

import Button from "@/components/ui/Button";
import FloatingInput from "@/components/ui/FloatingInput";
import { useAuth } from "@/context/AuthContext";
import { changePassword, ChangePasswordType } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
  const { logout } = useAuth();
  const router = useRouter();
  const [field, setField] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setField((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!field.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!field.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (field.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!field.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (field.confirmPassword !== field.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const { mutate: changePasswordMutation, isPending } = useMutation<
    { message: string },
    any,
    ChangePasswordType
  >({
    mutationFn: ({ oldPassword, newPassword }) =>
      changePassword({ oldPassword, newPassword }),
    onSuccess: (data) => {
      toast.success(data.message);
      logout();
      router.push("/auth");
    },
    onError: (data) => {
      toast.success(data.message);
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;
    changePasswordMutation({
      oldPassword: field.currentPassword,
      newPassword: field.newPassword,
    });
  };

  return (
    <div>
      <span className="text-xs tracking-[0.25em]  uppercase text-amber-400 font-medium">
        Change Password
      </span>
      <div className="grid pt-4 md:grid-cols-2 gap-2 mb-6">
        <FloatingInput
          name="currentPassword"
          value={field.currentPassword}
          onChange={handleChange}
          label="Current Password"
          type="password"
          error={errors.currentPassword}
          leftIcon={<Lock size={12} />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <FloatingInput
          name="newPassword"
          value={field.newPassword}
          onChange={handleChange}
          label="New Password"
          type="password"
          error={errors.newPassword}
          leftIcon={<Lock size={12} />}
        />

        <FloatingInput
          name="confirmPassword"
          value={field.confirmPassword}
          onChange={handleChange}
          label="Confirm New Password"
          type="password"
          error={errors.confirmPassword}
          leftIcon={<Lock size={12} />}
        />
      </div>

      <Button
        onClick={handleSubmit}
        variant="edit"
        className="mt-4 tracking-widest uppercase text-xs"
      >
        Change Password
      </Button>
    </div>
  );
}
