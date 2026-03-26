"use client";
import Button from "@/components/ui/Button";
import FloatingInput from "@/components/ui/FloatingInput";
import { useAuth, User } from "@/context/AuthContext";
import { getEditUser } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function EditPersonalDetails() {
  const { user, login, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [field, setField] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editMutation = useMutation<
    { message: string; user: User },
    any,
    FormData
  >({
    mutationFn: (formData) => getEditUser(formData),

    onSuccess: (data) => {
      login({
        user: data.user,
        accessToken: accessToken!,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message);
    },
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("firstName", field.firstName);
    formData.append("lastName", field.lastName);
    editMutation.mutate(formData);
  };

  return (
    <div>
      <span className="text-xs tracking-[0.25em] uppercase text-amber-400 font-medium">
        Edit Personal Details
      </span>
      <div className="grid pt-6 md:grid-cols-2 gap-2">
        <FloatingInput
          name="firstName"
          value={field.firstName}
          onChange={handleChange}
          label="Frist Name"
        />
        <FloatingInput
          name="lastName"
          value={field.lastName}
          onChange={handleChange}
          label="Last Name"
        />
      </div>
      <Button
        onClick={() => handleSubmit()}
        variant="edit"
        className="mt-4 tracking-widest uppercase text-xs"
      >
        Edit
      </Button>
    </div>
  );
}
