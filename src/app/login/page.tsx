"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

type Tab = "login" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <main className="min-h-[60vh] py-8 md:py-12">
      <Container className="mx-auto max-w-md">
        {/* Tabs */}
        <div className="relative mb-8 flex gap-6 border-b border-border">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={cn(
              "relative pb-4 text-xl font-light transition-colors",
              tab === "login"
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-selected={tab === "login"}
            role="tab"
            aria-controls="login-panel"
            id="login-tab"
          >
            Sign in
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
                tab === "login" ? "w-full" : "w-0",
              )}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={cn(
              "relative pb-4 text-xl font-light transition-colors",
              tab === "signup"
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-selected={tab === "signup"}
            role="tab"
            aria-controls="signup-panel"
            id="signup-tab"
          >
            Create Account
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
                tab === "signup" ? "w-full" : "w-0",
              )}
              aria-hidden
            />
          </button>
        </div>

        {/* Login Form */}
        {tab === "login" && (
          <div
            id="login-panel"
            role="tabpanel"
            aria-labelledby="login-tab"
            className="animate-in fade-in-0 duration-200"
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <Button type="submit" className="mt-2 w-full">
                Sign in
              </Button>
              <Link
                href="/forgot-password"
                className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </form>
          </div>
        )}

        {/* Signup Form */}
        {tab === "signup" && (
          <div
            id="signup-panel"
            role="tabpanel"
            aria-labelledby="signup-tab"
            className="animate-in fade-in-0 duration-200"
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <label
                htmlFor="signup-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <label
                htmlFor="signup-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <Button type="submit" className="mt-2 w-full">
                Create Account
              </Button>
            </form>
          </div>
        )}
      </Container>
    </main>
  );
}
