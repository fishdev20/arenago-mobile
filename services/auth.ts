import { BaseApi } from './api';

export class AuthService extends BaseApi {
  // async loginWithGoogle(): Promise<any> {
  //   const redirect =
  //         Platform.OS !== 'web'
  //           ? AuthSession.makeRedirectUri({
  //               path: 'auth-callback',
  //               scheme: 'clair',
  //               preferLocalhost: false,
  //             })
  //           : `${window.location.origin}/auth-callback`;
  // }
}
