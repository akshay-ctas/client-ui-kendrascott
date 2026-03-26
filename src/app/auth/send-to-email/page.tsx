"use client";
import { Suspense } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpVerifyEmail, sendOtpEmailVerify } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Verify Email",
//   description: "Enter the OTP sent to your email to verify your account.",
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const email = searchParams.get("email");
  const queryClient = useQueryClient();

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;

    setIsResending(true);
    if (email) {
      await sendOtpEmailVerify({ email });
    }
    toast("OTP sent again. Please check your inbox.");
    setIsResending(false);
    setResendCooldown(30);
  };

  useEffect(() => {
    if (!resendCooldown) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const data = {
    email,
    otp: value,
  };

  const emailVerificationMutation = useMutation<
    any,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: (data) => otpVerifyEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const handleClick = async () => {
    if (!data.email) {
      toast("Email is missing. Please try again.");
      return;
    }
    emailVerificationMutation.mutate(data as { email: string; otp: string });
    router.push("/profile");
  };

  return (
    <div className="max-w-7xl text-center space-y-5 mx-auto mt-10">
      <h1 className="text-2xl font-medium">OTP Authentication</h1>
      <p className="text-muted-foreground text-sm">
        Enter 6 digit otp send to your email
      </p>
      <div className="flex justify-center items-center">
        <InputOTP
          value={value}
          onChange={(value) => setValue(value)}
          className="outline-none"
          maxLength={6}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot className="border" index={0} />
            <InputOTPSlot className="border" index={1} />
            <InputOTPSlot className="border" index={2} />
            <InputOTPSlot className="border" index={3} />
            <InputOTPSlot className="border" index={4} />
            <InputOTPSlot className="border" index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <button
        onClick={handleClick}
        className="bg-gray-900 text-white px-4 text-xl rounded-md hover:bg-gray-500 hover:text-black py-2"
      >
        Verify
      </button>
      <p className="text-muted-foreground">
        Didn&apos;t recive an otp,{" "}
        <span
          onClick={handleResend}
          className="text-black font-medium hover:font-semibold duration-100 cursor-pointer disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
        </span>
      </p>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
