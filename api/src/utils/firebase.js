import firebaseInstance from './firebase-instance';

export { firebaseInstance }

// Check for existence of auth token in header
export function getAuthorizationHeader(context) {
console.log(88)
  if (!context || !context.headers || !context.headers.authorization) {
    throw new AuthenticationError("No authorization token." );
  }
console.log(context.headers.authorization)
  
  const token = context.headers.authorization;
  return token.replace("Bearer ", "");
}
