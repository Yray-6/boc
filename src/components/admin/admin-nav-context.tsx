"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminNavContextValue = {
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
};

const AdminNavContext = createContext<AdminNavContextValue | null>(null);

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(() => setMobileNavOpen((v) => !v), []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const value = useMemo(
    () => ({ mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav }),
    [mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav],
  );

  return <AdminNavContext.Provider value={value}>{children}</AdminNavContext.Provider>;
}

export function useAdminNav(): AdminNavContextValue {
  const ctx = useContext(AdminNavContext);
  if (!ctx) {
    throw new Error("useAdminNav must be used within AdminNavProvider");
  }
  return ctx;
}
