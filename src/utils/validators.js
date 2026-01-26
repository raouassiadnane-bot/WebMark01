// Small validators used by forms. Kept simple for clarity.
export function validateEmail(email){
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}

export function validatePassword(password){
  return typeof password === 'string' && password.length >= 6
}
