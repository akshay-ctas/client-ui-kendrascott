"use client";
import AddressesContent from "@/components/profile/AddressesContent";
import NotificationsContent from "@/components/profile/NotificationsContent";
import OrdersContent from "@/components/profile/OrdersContent";
import PersonalInfo from "@/components/profile/PersonalInfo";
import WishlistContent from "@/components/profile/WishlistContent";
import { useAuth } from "@/context/AuthContext";
import { Bell, Heart, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LogOutContent from "@/components/profile/LogOutContent";
import { useWishList } from "@/context/WishListContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { getOrders } from "@/app/actions/order.server";
type TabId = "profile" | "orders" | "addresses" | "wishlist" | "notifications";

type Tab = { id: TabId; label: string; icon: React.ReactNode; badge?: number };

function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishList } = useWishList();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId | null;
    if (
      tab &&
      ["profile", "orders", "addresses", "wishlist", "notifications"].includes(
        tab,
      )
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const TABS: Tab[] = useMemo(
    () => [
      { id: "profile", label: "Personal Info", icon: <User size={16} /> },
      {
        id: "orders",
        label: "My Orders",
        icon: <ShoppingBag size={16} />,
        badge: orders.length > 0 ? orders.length : undefined,
      },
      { id: "addresses", label: "Saved Addresses", icon: <MapPin size={16} /> },
      {
        id: "wishlist",
        label: "Wishlist",
        icon: <Heart size={16} />,
        badge: wishList.length > 0 ? wishList.length : undefined,
      },
      { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    ],
    [orders.length, wishList.length],
  );

  const CONTENT: Record<TabId, React.ReactNode> = {
    profile: <PersonalInfo />,
    orders: <OrdersContent loading={loading} orders={orders} />,
    addresses: <AddressesContent />,
    wishlist: <WishlistContent />,
    notifications: <NotificationsContent />,
  };

  if (!user) return null;
  const name = user?.firstName + " " + user.lastName;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <div className="w-64 shrink-0 sticky top-8 space-y-2">
            <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={name}
                  className="w-11 h-11 rounded-xlflex items-center justify-center rounded-lg shadow-md shadow-rose-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md shadow-rose-200">
                  {name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-stone-800 truncate">
                  {name}
                </p>
                <p className="text-xs text-stone-400 truncate">{user.email}</p>
              </div>
            </div>

            <nav className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 relative
                    ${i < TABS.length - 1 ? "border-b border-stone-50" : ""}
                    ${
                      activeTab === tab.id
                        ? "bg-rose-50 text-yellow-600"
                        : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                    }`}
                >
                  {activeTab === tab.id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r-full" />
                  )}
                  <span
                    className={
                      activeTab === tab.id
                        ? "text-yellow-500"
                        : "text-stone-400"
                    }
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`text-sm flex-1 ${activeTab === tab.id ? "font-semibold" : "font-medium"}`}
                  >
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center
                      ${activeTab === tab.id ? "bg-yellow-500 text-white" : "bg-stone-100 text-stone-500"}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <LogOutContent />
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white border border-stone-100 rounded-2xl p-6 min-h-96">
              {CONTENT[activeTab]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  );
}
