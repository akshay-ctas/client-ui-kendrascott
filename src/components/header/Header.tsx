"use client";

import Image from "next/image";
import Link from "next/link";
import { Handbag, Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { Container } from "@/components/ui/Container";
import { MAIN_NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";
import MegaContent from "./MegaContent";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Input } from "../ui/Input";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { totalItems } = useCart();

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(null), 120);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </Link>
        </div>

        <div className="hidden lg:block relative">
          <nav className="flex gap-6" onMouseLeave={handleLeave}>
            {MAIN_NAV_LINKS.map(({ href, label }) => (
              <div
                key={label}
                onMouseEnter={() => handleEnter(label)}
                className="py-1"
              >
                <NavLink href={href}>{label}</NavLink>
              </div>
            ))}
          </nav>

          {hovered && (
            <div
              className="absolute left-0 top-full w-full bg-white  shadow-lg"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleLeave}
            >
              <MegaContent active={hovered} />
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded">
            <Search
              size={18}
              className="text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />
            <Input
              type="search"
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-0 outline-none bg-transparent focus:ring-0"
            />
          </div>

          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
          >
            <Handbag
              size={20}
              className="group-hover:scale-110 transition-transform"
            />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </Container>

      <div
        className={cn(
          "lg:hidden transition-all overflow-hidden bg-white",
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="px-4 py-4 space-y-2">
          {MAIN_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="block text-base px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div className="mt-4 flex items-center bg-gray-100 px-3 py-2 rounded">
            <Search
              size={18}
              className="text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search"
              className="border-0 bg-transparent focus:ring-0"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
