"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type WarpTransitionProps = {
  onEndRoute?: string; // defaults to "/dashboard"
  visible: boolean;
};

export default function WarpTransition({ onEndRoute = "/dashboard", visible }: WarpTransitionProps) {
  const router = useRouter();

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      router.push(onEndRoute);
    }, 1500); // fallback in case onEnded fails
    return () => clearTimeout(timeout);
  }, [visible, router, onEndRoute]);

  if (!visible) return null;

  return (
    <video
      className="fixed inset-0 z-[9999] w-full h-full object-cover"
      autoPlay
      muted
      playsInline
      onEnded={() => router.push(onEndRoute)}
    >
      <source src="/animations/eonic-warp.webm" type="video/webm" />
    </video>
  );
} 