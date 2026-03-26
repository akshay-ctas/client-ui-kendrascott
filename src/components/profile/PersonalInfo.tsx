"use client";
import { useAuth, User } from "@/context/AuthContext";
import { sendOtpEmailVerify } from "@/services/auth.service";
import { getEditUser, getMe } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader2,
  Mail,
  PersonStandingIcon,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import EditPersonalDetails from "./info/EditPersonalDetails";
import { useRef } from "react";
import { toast } from "sonner";
import ChangePassword from "./info/ChangePassword";

export default function PersonalInfo() {
  const { user, login, accessToken } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const name = user?.firstName + " " + user?.lastName;
  const fields = [
    { label: "Full Name", value: name, icon: <User2 size={14} /> },

    {
      label: "Email Address",
      value: user?.email,
      icon: <Mail size={14} />,
      badge: user?.isEmailVerified ? (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
          <CheckCircle size={12} />
          Verified
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          <AlertCircle size={12} />
          Not Verified
        </span>
      ),
    },

    {
      label: "Role",
      value: user?.role,
      icon: <PersonStandingIcon size={14} />,
    },
  ];

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  const isEmailVerified = true;

  const handleverify = async () => {
    try {
      await sendOtpEmailVerify({ email: data?.user.email });
      router.push(`/auth/send-to-email?email=${data?.user.email}`);
    } catch (error) {}
  };

  const handleSelect = () => {
    fileRef.current?.click();
  };
  const { mutate: editMutation, isPending } = useMutation<
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    editMutation(formData);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className=" tracking-[0.25em] uppercase text-amber-400 font-medium">
            Personal Info
          </span>
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium">
            Manage your personal details
          </p>
        </div>
      </div>
      {!isEmailVerified && (
        <div className="flex items-center gap-3 p-6 bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl border border-yellow-200 shadow-sm">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Verify your email to continue
            </p>
            <p className="text-xs text-gray-600">
              Complete your registration and unlock full access to your account
            </p>
          </div>
          <button
            onClick={handleverify}
            className="inline-flex items-center bg-amber-200 px-4 py-2 rounded-md hover:text-amber-600 cursor-pointer  text-sm font-semibold bg-linear-to-r text-gray-900  transition-all duration-200 border border-yellow-300"
          >
            Verify Now
          </button>
        </div>
      )}
      <div className="flex items-center gap-5 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
        <div
          className="relative w-20 h-20 group cursor-pointer"
          onClick={handleSelect}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-200">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              name.charAt(0)
            )}
          </div>

          {isPending && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="animate-spin  text-white" size={18} />
            </div>
          )}

          {!isPending && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera size={18} className="text-white" />
            </div>
          )}

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="font-bold text-stone-800 text-lg">{name}</p>
          <p className="text-sm text-stone-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex items-start gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
              {f.icon}
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-stone-500">{f.label}</p>

              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-stone-800">
                  {f.value || "-"}
                </p>
                {f.badge}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className=" h-px bg-linear-to-r from-amber-400/40 via-stone-700 to-transparent" />

      <div>
        <EditPersonalDetails />
      </div>
      <div className=" h-px bg-linear-to-r from-amber-400/40 via-stone-700 to-transparent" />

      <div>
        <ChangePassword />
      </div>
    </div>
  );
}
