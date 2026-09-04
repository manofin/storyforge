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

type MobileShellContextValue = {
  leftOpen: boolean;
  rightOpen: boolean;
  openLeft: () => void;
  closeLeft: () => void;
  toggleLeft: () => void;
  openRight: () => void;
  closeRight: () => void;
  toggleRight: () => void;
};

const MobileShellContext = createContext<MobileShellContextValue | null>(null);

export function MobileShellProvider({ children }: { children: ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const openLeft = useCallback(() => {
    setRightOpen(false);
    setLeftOpen(true);
  }, []);
  const closeLeft = useCallback(() => setLeftOpen(false), []);
  const toggleLeft = useCallback(() => {
    setLeftOpen((v) => {
      if (!v) setRightOpen(false);
      return !v;
    });
  }, []);

  const openRight = useCallback(() => {
    setLeftOpen(false);
    setRightOpen(true);
  }, []);
  const closeRight = useCallback(() => setRightOpen(false), []);
  const toggleRight = useCallback(() => {
    setRightOpen((v) => {
      if (!v) setLeftOpen(false);
      return !v;
    });
  }, []);

  useEffect(() => {
    if (!leftOpen && !rightOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [leftOpen, rightOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const value = useMemo(
    () => ({
      leftOpen,
      rightOpen,
      openLeft,
      closeLeft,
      toggleLeft,
      openRight,
      closeRight,
      toggleRight,
    }),
    [
      leftOpen,
      rightOpen,
      openLeft,
      closeLeft,
      toggleLeft,
      openRight,
      closeRight,
      toggleRight,
    ]
  );

  return (
    <MobileShellContext.Provider value={value}>{children}</MobileShellContext.Provider>
  );
}

export function useMobileShell() {
  const ctx = useContext(MobileShellContext);
  if (!ctx) {
    throw new Error("useMobileShell must be used within MobileShellProvider");
  }
  return ctx;
}
