import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // user id
  email: string;
  exp: number;
  iat: number;
}

export function decodeJWT(token: string) {
  const decoded = jwtDecode<DecodedToken>(token);

  return decoded;
}
