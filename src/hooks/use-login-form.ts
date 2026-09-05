import React, { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { useGuestOnly } from "./use-guest-only";
import { useResendCooldown } from "./use-resend-cooldown";

export function useLoginForm() {
  useGuestOnly("/account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);

  const {
    handleSignInEmail,
    handleSignInGoogle,
    handleSendVerificationEmail,
    isLoading,
    authError,
    setAuthError,
  } = useAuth();

  const { cooldownSeconds, isCooldownActive, startCooldown } = useResendCooldown(email, 60);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      const urlUnverified = params.get("unverified");
      if (urlEmail) {
        setEmail(urlEmail);
      }
      if (urlUnverified === "true") {
        setIsUnverified(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnverified(false);

    const success = await handleSignInEmail(email, password);
    if (success) {
      window.location.href = "/account";
    } else {
      if (authError && (authError.toLowerCase().includes("verified") || authError.toLowerCase().includes("verifikasi"))) {
        setIsUnverified(true);
      }
    }
  };

  const handleResendUnverified = async () => {
    if (!email) {
      setAuthError("Masukkan alamat email Anda terlebih dahulu.");
      return;
    }
    if (isCooldownActive || isLoading) return;

    const ok = await handleSendVerificationEmail(email);
    if (ok) {
      startCooldown(60);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isUnverified,
    setIsUnverified,
    isLoading,
    authError,
    cooldownSeconds,
    isCooldownActive,
    handleSubmit,
    handleResendUnverified,
    handleSignInGoogle,
  };
}
