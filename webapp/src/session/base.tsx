export interface SessionManager {

  canRecoverSessionFromCache: () => boolean

  getHeadersForAuthorisedRequest: () => { [key: string]: string }

  retrieveSession:
    (onSuccess: (userName: string) => void, onError?: () => void) => void

  retrieveUserAttributes: (
    onSuccess: (attributes: { [key: string]: string }) => void,
    onError?: () => void
  ) => void

  signUpUser: (
    userName: string,
    password: string,
    email?: string,
    onSuccess?: () => void,
    onError?: (errorMessage?: string) => void
  ) => void

  logInUser: (
    userName: string,
    password: string,
    onSuccess: () => void,
    onError: (errorMessage?: string) => void
  ) => void

  logOutUser: (
    onSuccess: () => void,
    onError: (errorMessage?: string) => void
  ) => void
}
