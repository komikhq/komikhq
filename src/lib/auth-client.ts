import { createAuthClient } from "better-auth/react";
import { getBaseApiUrl } from "./api-client";
import { API_PREFIX } from "@/constants/api-routes";

export const authClient = createAuthClient({
  baseURL: getBaseApiUrl(),
  basePath: `${API_PREFIX}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
