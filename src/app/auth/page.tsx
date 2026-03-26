import AuthTabs from "@/components/auth/AuthTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login or Sign Up",
  description: "Access your account or create a new account to start shopping.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return <AuthTabs />;
}
