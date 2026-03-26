"use client";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useUnreadNotificationsCount } from "@/hooks/useUnreadNotificationsCount";
import Button from "../ui/Button";

const topBarLinks = [
  { src: "/black-ks-utility.svg", alt: "Kendra Scott", href: "/" },
  { src: "/black-yr-utility.svg", alt: "Year", href: "/" },
] as const;

export default function TopBar() {
  const { user } = useAuth();
  useNotificationSocket(user?.id, Boolean(user?.id));
  const unreadCount = useUnreadNotificationsCount(Boolean(user?.id));

  return (
    <div className="py-2" style={{ backgroundColor: "var(--brand-yellow)" }}>
      <Container className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {topBarLinks.map(({ src, alt, href }) => (
            <Link
              key={src}
              href={href}
              className="rounded px-2 py-2 transition-colors hover:bg-(--brand-coral-light)"
            >
              <Image
                src={src}
                alt={alt}
                width={118}
                height={12}
                className="h-auto w-auto object-contain"
              />
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/profile?tab=notifications"
            className="relative rounded p-1 transition-colors hover:bg-(--brand-coral)"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            href={user ? "/profile" : "/auth"}
            className="rounded p-1 transition-colors hover:bg-(--brand-coral)"
            aria-label="Account"
          >
            <Image
              src="/user-circle-black.svg"
              alt=""
              height={16}
              width={16}
              aria-hidden
            />
          </Link>
          <Link
            href="/wishlist"
            className="rounded p-1 transition-colors hover:bg-(--brand-coral)"
            aria-label="Wishlist"
          >
            <Image
              src="/heart-black.svg"
              alt=""
              height={16}
              width={16}
              aria-hidden
            />
          </Link>
          <Link
            href="/stores"
            className="flex items-center gap-1 rounded p-1 text-sm font-light transition-colors hover:bg-(--brand-coral)"
          >
            <Image
              src="/pin-black.svg"
              alt=""
              height={16}
              width={16}
              aria-hidden
            />
            <span className="hidden sm:inline">Find a Store</span>
          </Link>
          <span className="text-gray-500" aria-hidden>
            |
          </span>
          <Button
            variant="ghost"
            className="hidden font-light hover:bg-(--brand-coral) sm:inline-flex"
          >
            Enable Accessibility
          </Button>
        </div>
      </Container>
    </div>
  );
}
