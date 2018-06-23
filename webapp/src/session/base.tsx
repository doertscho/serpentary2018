export interface SessionManager {

  canRecoverSessionFromCache: () => boolean

  getHeadersForAuthorisedRequest: () => { [key: string]: string }

  retrieveSession: (
    onSuccess: (userName: string, isAdmin: boolean) => void,
    onError?: () => void
  ) => void

  refreshSession:
    (onSuccess: () => void, onError?: () => void) => void

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
    onSuccess: (isAdmin: boolean) => void,
    onError: (errorMessage?: string) => void
  ) => void

  logOutUser: (
    onSuccess: () => void,
    onError: (errorMessage?: string) => void
  ) => void

  updatePreferredName:
    (newName: string, onSuccess: () => void, onError: () => void) => void
}
