import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | BOC Real Estate",
    default: "Admin | BOC Real Estate",
  },
  description: "BOC Real Estate admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
