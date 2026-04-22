import type { Metadata } from "next";
import { AdminEnquiries } from "@/components/admin/admin-enquiries";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default function AdminEnquiriesPage() {
  return <AdminEnquiries />;
}
