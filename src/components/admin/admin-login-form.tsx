"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [remember, setRemember] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Wire to auth when backend exists
  }

  return (
    <form
      className="flex w-full max-w-[504px] flex-col gap-6"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          className="text-left text-sm leading-[1.4286] text-[#314158]"
          htmlFor="admin-email"
        >
          Email Address
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
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder=""
            className="h-[50px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172B] outline-none ring-[#2A478D]/30 placeholder:text-[#90A1B9] focus:border-[#2A478D] focus:ring-2"
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
            className="h-[50px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm text-[#0F172B] outline-none ring-[#2A478D]/30 placeholder:text-[#90A1B9] focus:border-[#2A478D] focus:ring-2"
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
            className="size-4 rounded border-[#E2E8F0] text-[#2A478D] focus:ring-[#2A478D]"
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
        className="relative flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[#2A478D] text-sm font-bold leading-[1.4286] text-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition hover:bg-[#243d75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A478D]"
      >
        Sign In
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
