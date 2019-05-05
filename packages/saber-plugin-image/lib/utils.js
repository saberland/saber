export const optionPriority = (general, specific, key) =>
  specific[key] || (specific[key] !== false && general[key])
