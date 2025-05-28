export const encodeBase64 = (str: string): string => {
  try {
    // For browser environment
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    throw new Error('Invalid input for Base64 encoding');
  }
};

export const decodeBase64 = (str: string): string => {
  try {
    // For browser environment
    return decodeURIComponent(escape(atob(str)));
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
};

export const isValidBase64 = (str: string): boolean => {
  try {
    return btoa(atob(str)) === str;
  } catch (error) {
    return false;
  }
};

export const getBase64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};