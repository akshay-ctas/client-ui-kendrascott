"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function PersonalDetails() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Personal Details</h2>

      <div className="flex items-center gap-4">
        {/* <Image
          src={user.avatar}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full object-cover border"
        /> */}

        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">First Name</p>
          <p className="font-medium">{user.firstName}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Last Name</p>
          <p className="font-medium">{user.lastName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Phone</p>
          <p className="font-medium">{user?.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Gender</p>
          <p className="font-medium capitalize">{user?.gender}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Role</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-xs text-gray-500">Email Verification</p>
        <p
          className={`font-medium ${
            user.isEmailVerified ? "text-green-600" : "text-red-500"
          }`}
        >
          {user.isEmailVerified ? "Verified" : "Not Verified"}
        </p>
      </div>
    </div>
  );
}
