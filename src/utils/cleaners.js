export const cleanText = (text) => {
  return text.replace(/[A-Za-z]/g, '');
}

export const cleanNumbers = (numbers) => {
  return numbers.replace(/[^0-9]/g, '')
}
