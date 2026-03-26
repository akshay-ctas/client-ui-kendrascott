"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };
  return (
    <button
      onClick={handleGoBack}
      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
    >
      <ArrowLeft size={20} />
      Go Back
    </button>
  );
}
