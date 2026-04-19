import type { Metadata } from "next";
import { AdminAgents } from "@/components/admin/admin-agents";

export const metadata: Metadata = {
  title: "Agents",
};

export default function AdminAgentsPage() {
  return <AdminAgents />;
}
