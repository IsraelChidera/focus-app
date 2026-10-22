const AUTH_MESSAGES = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-login-credentials": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/weak-password": "Choose a stronger password (at least 8 characters).",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Can't reach the server. Check your connection and try again.",
  "auth/missing-email": "Enter your email address.",
  "auth/operation-not-allowed": "Email sign-in isn't enabled for this app yet.",
  "auth/invalid-api-key": "The app is misconfigured (invalid API key).",
};

const FIRESTORE_MESSAGES = {
  "permission-denied": "You don't have permission to do that.",
  unauthenticated: "Your session has expired. Please sign in again.",
  unavailable: "You appear to be offline. Check your connection and try again.",
  "deadline-exceeded": "The request took too long. Please try again.",
  "not-found": "That entry no longer exists.",
  "resource-exhausted": "We're receiving too many requests. Please try again shortly.",
};

const FALLBACK = "Something went wrong. Please try again.";

export function getAuthErrorMessage(error) {
  return AUTH_MESSAGES[error?.code] || FALLBACK;
}

export function getDataErrorMessage(error) {
  return FIRESTORE_MESSAGES[error?.code] || FALLBACK;
}
