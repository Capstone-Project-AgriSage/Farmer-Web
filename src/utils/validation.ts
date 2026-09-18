const PHONE_REGEX = /^(0|\+84)\d{9,10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.replace(/\s/g, ''))
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidPhoneOrEmail(value: string): boolean {
  return isValidPhone(value) || isValidEmail(value)
}
