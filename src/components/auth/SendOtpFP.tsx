"use client";

import { useRef } from "react";
import { Input } from "../ui/input";
import { sendOtpForForgotPassword } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SendOtpFp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const email = emailRef.current?.value;

    if (!email) {
      toast("Please enter your email");
      return;
    }
    await sendOtpForForgotPassword({ email });
    router.push(`/auth/forgot-password/verify?email=${email}`);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mt-12">Forgot Password</h1>
      <p className="text-muted-foreground mt-5 ">
        Enter the email associated with your account. You will receive an email
        with a OTP.
      </p>
      <Input
        className="mt-5 h-12"
        type="text"
        ref={emailRef}
        placeholder="Email"
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className=" bg-[#dcf2e1] rounded-full text-[#222] py-3.75 px-12.5 mt-2 hover:bg-gray-200 transition"
      >
        Submit
      </button>
    </div>
  );
}
