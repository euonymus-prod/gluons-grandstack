import firebaseInstance from './firebase-instance';

export { firebaseInstance }

// Check for existence of auth token in header
export function getAuthorizationHeader(context) {
  if (!context || !context.headers || !context.headers.authorization) {
    throw new AuthenticationError("No authorization token." );
  }
  
  const token = context.headers.authorization;
  return token.replace("Bearer ", "");
}
