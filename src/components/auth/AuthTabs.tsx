"use client";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AuthTabs() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <section className="flex flex-col mt-10 justify-center">
      <div className="relative min-w-xl mx-auto ">
        <div className="flex border-b py-1">
          <div className="w-1/2 text-2xl text-center">
            <button
              className={cn(
                "cursor-pointer duration-300",
                tab === "login" ? "font-medium" : "text-gray-600",
              )}
              onClick={() => setTab("login")}
            >
              Login
            </button>
          </div>

          <div className="w-1/2 text-2xl text-center">
            <button
              className={cn(
                "cursor-pointer duration-300",
                tab === "signup" ? "font-medium" : "text-gray-600",
              )}
              onClick={() => setTab("signup")}
            >
              Create Account
            </button>{" "}
          </div>
        </div>

        <span
          className={cn(
            "absolute bottom-0 border h-px w-1/2 border-black duration-300 ease-in-out",
            tab === "login" ? "left-0" : "left-1/2",
          )}
        ></span>
      </div>
      <div className="relative min-w-xl max-w-2xl mx-auto ">
        {tab === "login" ? <Login /> : <SignUp />}
      </div>
    </section>
  );
}
