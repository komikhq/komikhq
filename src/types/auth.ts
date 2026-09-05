export interface LoginFormState {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  errorMsg: string | null;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
}

export interface RegisterFormState {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirm: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  errorMsg: string | null;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
}

export interface VerifyEmailState {
  status: "loading" | "success" | "error";
  errorMsg: string | null;
}
