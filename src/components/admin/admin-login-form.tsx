"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/admin-auth-client";

function safeInternalPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/admin";
  }
  return next;
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminLogin(username.trim(), password, remember);
      const next = safeInternalPath(searchParams.get("next"));
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="flex w-full max-w-[504px] flex-col gap-6"
      onSubmit={onSubmit}
      noValidate
    >
      {error ? (
        <p
          className="rounded-[14px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          className="text-left text-sm leading-[1.4286] text-[#314158]"
          htmlFor="admin-username"
        >
          Username
        </label>
        <div className="relative h-[50px]">
          <span
            className="pointer-events-none absolute left-0 top-0 flex h-[50px] w-8 items-center justify-center pl-3"
            aria-hidden
          >
            <Image
              src="/admin-login/icon-email.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </span>
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            disabled={submitting}
            className="h-[50px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172B] outline-none ring-[#2A478D]/30 placeholder:text-[#90A1B9] focus:border-[#2A478D] focus:ring-2 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-left text-sm leading-[1.4286] text-[#314158]"
          htmlFor="admin-password"
        >
          Password
        </label>
        <div className="relative h-[50px]">
          <span
            className="pointer-events-none absolute left-0 top-0 flex h-[50px] w-8 items-center justify-center pl-3"
            aria-hidden
          >
            <Image
              src="/admin-login/icon-lock.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </span>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            disabled={submitting}
            className="h-[50px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172B] outline-none ring-[#2A478D]/30 placeholder:text-[#90A1B9] focus:border-[#2A478D] focus:ring-2 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={submitting}
            className="size-4 rounded border-[#E2E8F0] text-[#2A478D] focus:ring-[#2A478D] disabled:opacity-60"
          />
          <span className="text-sm leading-[1.4286] text-[#45556C]">
            Remember me
          </span>
        </label>
        <a
          href="#"
          className="shrink-0 text-sm leading-[1.4286] text-[#155DFC] underline-offset-2 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="relative flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[#2A478D] text-sm font-bold leading-[1.4286] text-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition hover:bg-[#243d75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A478D] disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign In"}
        <Image
          src="/admin-login/icon-arrow.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
      </button>
    </form>
  );
}
