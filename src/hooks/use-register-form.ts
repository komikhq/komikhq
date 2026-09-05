import React, { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { useResendCooldown } from "./use-resend-cooldown";

export function useRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      const urlSent = params.get("sent");
      if (urlEmail) {
        setEmail(urlEmail);
      }
      if (urlSent === "true" && urlEmail) {
        setIsSuccess(true);
      }
    }
  }, []);

  const {
    handleSignUpEmail,
    handleSignInGoogle,
    handleSendVerificationEmail,
    isLoading,
    authError,
    setAuthError,
  } = useAuth();

  const { cooldownSeconds, isCooldownActive, startCooldown } = useResendCooldown(email, 60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setAuthError("Kata sandi minimal 8 karakter.");
      return;
    }

    const success = await handleSignUpEmail(name, email, password);
    if (success) {
      setIsSuccess(true);
      startCooldown(60);
      if (typeof window !== "undefined") {
        const newUrl = `${window.location.pathname}?sent=true&email=${encodeURIComponent(email)}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    }
  };

  const handleResend = async () => {
    if (isCooldownActive || isLoading) return;
    const ok = await handleSendVerificationEmail(email);
    if (ok) {
      startCooldown(60);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSuccess,
    isLoading,
    authError,
    cooldownSeconds,
    isCooldownActive,
    handleSubmit,
    handleResend,
    handleSignInGoogle,
  };
}
