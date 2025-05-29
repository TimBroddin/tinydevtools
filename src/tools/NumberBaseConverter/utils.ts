export const BASES = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
} as const;

export type SupportedBase = keyof typeof BASES;

export const convertFromBase = (value: string, fromBase: SupportedBase): number => {
  let trimmedValue = value.trim().replace(/\s+/g, '');
  
  if (!trimmedValue) {
    throw new Error('Input cannot be empty');
  }

  // Handle hexadecimal prefix for base 16
  if (fromBase === 16 && (trimmedValue.toLowerCase().startsWith('0x') || trimmedValue.toLowerCase().startsWith('0X'))) {
    trimmedValue = trimmedValue.slice(2);
  }

  // Validate characters for the given base
  const validChars = getValidCharsForBase(fromBase);
  const upperValue = trimmedValue.toUpperCase();
  
  for (const char of upperValue) {
    if (!validChars.includes(char)) {
      throw new Error(`Invalid character "${char}" for base ${fromBase}`);
    }
  }

  const result = parseInt(trimmedValue, fromBase);
  
  if (isNaN(result)) {
    throw new Error(`Invalid number for base ${fromBase}`);
  }
  
  if (!isFinite(result)) {
    throw new Error('Number is too large');
  }
  
  return result;
};

export const convertToBase = (value: number, toBase: SupportedBase): string => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Value must be a non-negative integer');
  }
  
  if (!isFinite(value)) {
    throw new Error('Number is too large');
  }
  
  return value.toString(toBase).toUpperCase();
};

export const convertBetweenBases = (
  value: string, 
  fromBase: SupportedBase, 
  toBase: SupportedBase
): string => {
  if (fromBase === toBase) {
    return value.trim();
  }
  
  const decimalValue = convertFromBase(value, fromBase);
  return convertToBase(decimalValue, toBase);
};

export const getValidCharsForBase = (base: SupportedBase): string[] => {
  switch (base) {
    case 2:
      return ['0', '1'];
    case 8:
      return ['0', '1', '2', '3', '4', '5', '6', '7'];
    case 10:
      return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    case 16:
      return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    default:
      return [];
  }
};

export const isValidForBase = (value: string, base: SupportedBase): boolean => {
  try {
    convertFromBase(value, base);
    return true;
  } catch {
    return false;
  }
};

export const getMaxSafeValueForBase = (base: SupportedBase): string => {
  const maxSafeInteger = Number.MAX_SAFE_INTEGER;
  return convertToBase(maxSafeInteger, base);
};

export const formatWithSpaces = (value: string, base: SupportedBase): string => {
  if (!value) return value;
  
  // Group digits for better readability
  switch (base) {
    case 2:
      // Group binary in groups of 4
      return value.match(/.{1,4}/g)?.join(' ') || value;
    case 8:
      // Group octal in groups of 3
      return value.match(/.{1,3}/g)?.join(' ') || value;
    case 10:
      // Group decimal in groups of 3 from right
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    case 16:
      // Group hex in groups of 4
      return value.match(/.{1,4}/g)?.join(' ') || value;
    default:
      return value;
  }
}; 