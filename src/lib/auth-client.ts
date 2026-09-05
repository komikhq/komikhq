import { createAuthClient } from "better-auth/react";
import { getBaseApiUrl } from "./api-client";

export const authClient = createAuthClient({
  baseURL: getBaseApiUrl(),
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
