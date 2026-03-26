import type { Metadata } from "next";
import ProfilePage from "@/components/profile/ProfilePage";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your profile, orders, addresses, wishlist, and notifications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ProfilePage />;
}
