export interface Account {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  password?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  issuer?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewAccount = Omit<Account, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserProfileDetails {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string | null;
  role: string;
  createdAt: Date;
}
