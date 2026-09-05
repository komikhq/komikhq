import { createAuthClient } from "better-auth/react";
import { getBaseApiUrl } from "./api-client";
import { API_ROUTES } from "@/constants/api-routes";

export const authClient = createAuthClient({
  baseURL: `${getBaseApiUrl()}${API_ROUTES.AUTH.BASE}`,
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
