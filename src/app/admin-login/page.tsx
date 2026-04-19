import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | BOC Real Estate",
  description: "Securely login to your account",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-y-auto px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/admin-login/admin-bg-4bc5dc.png)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/20"
        aria-hidden
      />

      <div
        className="relative z-10 flex w-full max-w-[576px] flex-col items-center gap-[22px] rounded-[24px] border border-[#F1F5F9] bg-white px-6 pb-8 pt-9 shadow-[0px_25px_50px_-12px_rgba(28,57,142,0.1)] sm:px-10"
      >
        <Image
          src="/admin-login/admin-logo-1b9721.png"
          alt="BOC Real Estate"
          width={156}
          height={86}
          className="h-[86px] w-[156px] object-contain"
          priority
        />

        <div className="flex w-full flex-col items-center gap-1 text-center">
          <h1 className="w-full font-sans text-2xl font-bold leading-[1.333] text-[#0F172B]">
            Admin Login
          </h1>
          <p className="font-sans text-base font-normal leading-normal text-[#62748E]">
            Securely login to your account
          </p>
        </div>

        <AdminLoginForm />

        <div className="flex max-w-[382px] flex-col items-center gap-1 text-center">
          <p className="font-sans text-xs leading-[1.333] text-[#90A1B9]">
            By logging in, you agree to our{" "}
            <a
              href="#"
              className="text-[#155DFC] underline-offset-2 hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-[#155DFC] underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p className="font-sans text-xs leading-[1.333] text-[#90A1B9]">
            Protected by reCAPTCHA.
          </p>
        </div>
      </div>
    </div>
  );
}
