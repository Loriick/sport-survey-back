export interface User {
  email: string;
  displayName: string;
  username?: string;
  picturePath: string;
  provider: string;
  providerId: string;
}

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  username: string;
  photo?: string;
};
