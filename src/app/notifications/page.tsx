"use client";
// Initialize the JS client
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!,
);

function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    { id: number; description: string; amount: number }[]
  >([]);
  useEffect(() => {
    // Listen to inserts
    supabase
      .channel("donations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public" },
        (change) => {
          setNotifications((notifications) => [
            ...notifications,
            change.new as { id: number; description: string; amount: number },
          ]);
        },
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (notifications.length) {
      const timeout = setTimeout(() => {
        setNotifications((notifications) => notifications.slice(1));
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  if (!notifications.length) {
    return null;
  }

  return (
    <section className="grid items-center text-center justify-center gap-2 absolute bottom-4 right-4 bg-black border p-4 rounded-md">
      <p className="text-2xl font-bold">
        {notifications[0].amount.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}
      </p>
      <p>{notifications[0].description}</p>
    </section>
  );
}

export default NotificationsPage;
