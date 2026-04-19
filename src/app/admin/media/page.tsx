import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library",
};

export default function AdminMediaPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-[#0F172B]">Media Library</h1>
      <p className="mt-2 text-sm text-[#62748E]">
        Upload and organize images and files here.
      </p>
    </div>
  );
}
