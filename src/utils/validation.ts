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

/** The backend's rule for a phone number: a Vietnamese mobile, 0 + (3|5|7|8|9) + 8 digits, as 0xxxxxxxxx, +84 or 84. */
export function isVietnameseMobile(value: string): boolean {
  let digits = value.replace(/[\s.\-()]/g, '')
  if (digits.startsWith('+84')) digits = `0${digits.slice(3)}`
  else if (digits.startsWith('84') && digits.length === 11) digits = `0${digits.slice(2)}`
  return /^0(3|5|7|8|9)\d{8}$/.test(digits)
}
