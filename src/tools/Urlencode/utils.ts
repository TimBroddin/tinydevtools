export const encodeURL = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch {
    throw new Error('Invalid input for URL encoding');
  }
};

export const decodeURL = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch {
    throw new Error('Invalid URL encoded string');
  }
};

export const encodeURLPath = (str: string): string => {
  try {
    // Encode for URL path (doesn't encode forward slashes)
    return str.split('/').map(segment => encodeURIComponent(segment)).join('/');
  } catch {
    throw new Error('Invalid input for URL path encoding');
  }
};

export const isValidURLEncoded = (str: string): boolean => {
  try {
    return encodeURIComponent(decodeURIComponent(str)) === str;
  } catch {
    return false;
  }
};

export const encodeQueryParams = (params: Record<string, string>): string => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

export const decodeQueryParams = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}; 