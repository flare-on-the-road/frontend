export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
  department?: string | null;
  phone?: string | null;
  profileImageUrl?: string | null;
  profileImageFile?: AuthFile | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type UpdateProfilePayload = {
  name: string;
  department?: string;
  phone?: string;
};

export type AuthFile = {
  id: string;
  ownerUserId?: string | null;
  originalFilename: string;
  storedFilename: string;
  storageProvider: string;
  bucket: string;
  objectKey: string;
  publicUrl?: string | null;
  contentType: string;
  byteSize: number;
  checksumSha256: string;
  purpose: string;
  entityType?: string | null;
  entityId?: string | null;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};
