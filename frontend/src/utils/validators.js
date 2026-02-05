export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\s/g, ''));
}

export function validateRequired(value) {
  return value && value.toString().trim().length > 0;
}

export function validateMinLength(value, minLength) {
  return value && value.length >= minLength;
}
