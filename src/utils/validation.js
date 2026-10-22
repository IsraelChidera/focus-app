const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN = 8;

export function validateEmail(value) {
  const email = value?.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address, like name@example.com.";
  return undefined;
}

export function validateName(value, label) {
  const name = value?.trim();
  if (!name) return `Enter your ${label}.`;
  if (name.length > 50) return `Your ${label} must be 50 characters or fewer.`;
  return undefined;
}

export function validateNewPassword(value) {
  if (!value) return "Create a password.";
  if (value.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
  return undefined;
}

/** Drops undefined entries so Formik sees a clean errors object. */
export function collectErrors(entries) {
  return Object.fromEntries(Object.entries(entries).filter(([, message]) => message));
}
