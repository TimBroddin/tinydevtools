export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};

export const toLowerCase = (text: string): string => {
  return text.toLowerCase();
};

export const toCapitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const toCamelCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

export const toPascalCase = (text: string): string => {
  const camelCase = toCamelCase(text);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

export const toSnakeCase = (text: string): string => {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
};

export const toKebabCase = (text: string): string => {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-');
};

export const toRandomCase = (text: string): string => {
  return text
    .split('')
    .map(char => {
      if (Math.random() > 0.5) {
        return char.toUpperCase();
      } else {
        return char.toLowerCase();
      }
    })
    .join('');
};

export const toAlternatingCase = (text: string): string => {
  return text
    .split('')
    .map((char, index) => {
      if (index % 2 === 0) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    })
    .join('');
};

export const toInverseCase = (text: string): string => {
  return text
    .split('')
    .map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    })
    .join('');
};

export type CaseType = 
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'titlecase'
  | 'camelcase'
  | 'pascalcase'
  | 'snakecase'
  | 'kebabcase'
  | 'randomcase'
  | 'alternatingcase'
  | 'inversecase';

export const convertCase = (text: string, caseType: CaseType): string => {
  switch (caseType) {
    case 'uppercase':
      return toUpperCase(text);
    case 'lowercase':
      return toLowerCase(text);
    case 'capitalize':
      return toCapitalize(text);
    case 'titlecase':
      return toTitleCase(text);
    case 'camelcase':
      return toCamelCase(text);
    case 'pascalcase':
      return toPascalCase(text);
    case 'snakecase':
      return toSnakeCase(text);
    case 'kebabcase':
      return toKebabCase(text);
    case 'randomcase':
      return toRandomCase(text);
    case 'alternatingcase':
      return toAlternatingCase(text);
    case 'inversecase':
      return toInverseCase(text);
    default:
      return text;
  }
}; 