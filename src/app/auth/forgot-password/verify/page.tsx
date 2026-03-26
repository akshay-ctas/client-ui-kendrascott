import VerifyOtpFP from "@/components/auth/verifyOtpFP";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your OTP to securely reset your password.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "/verify-otp",
  },
};

const page = () => {
  return (
    <Suspense fallback={null}>
      <VerifyOtpFP />
    </Suspense>
  );
};

export default page;
