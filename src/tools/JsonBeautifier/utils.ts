export const validateJson = (jsonString: string): { isValid: boolean; message: string } => {
  try {
    JSON.parse(jsonString);
    return { isValid: true, message: 'Valid JSON' };
  } catch (err) {
    const errorMessage = (err as Error).message || 'Invalid JSON';
    return { isValid: false, message: errorMessage };
  }
};

export const formatJson = (jsonString: string, spaces: number): string => {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed, null, spaces);
};

export const detectJsonType = (json: any): string => {
  if (json === null) return 'null';
  if (Array.isArray(json)) return 'array';
  return typeof json;
};

export const analyzeJson = (json: any): {
  type: string;
  size: number;
  keyCount?: number;
  arrayLength?: number;
} => {
  const type = detectJsonType(json);
  let result: any = { type };

  if (type === 'object') {
    const keys = Object.keys(json);
    result.keyCount = keys.length;
    result.size = JSON.stringify(json).length;
  } else if (type === 'array') {
    result.arrayLength = json.length;
    result.size = JSON.stringify(json).length;
  } else {
    result.size = JSON.stringify(json).length;
  }

  return result;
};