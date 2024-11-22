export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : 'El correo electrónico no es válido';
}

export const validateTextOnlyField = (text) => {
  const regex = /[^0-9]/;
  return regex.test(text) ? null : 'El campo no contiene solo texto'
}

export const validateNumberField = (text) => {
  const regex = [0-9];
  return regex.test(text) ? null : 'El campo no contiene solo números'
}
