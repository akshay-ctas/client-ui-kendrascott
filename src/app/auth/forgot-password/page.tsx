import SendOtpFp from "@/components/auth/SendOtpFP";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Enter your email or mobile number to receive an OTP and reset your password.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <SendOtpFp />;
}
