import { SessionManager } from './base'
import CognitoSessionManager from './cognito'

export const sessionManager: SessionManager = new CognitoSessionManager()
