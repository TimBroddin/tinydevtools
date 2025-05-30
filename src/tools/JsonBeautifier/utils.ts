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

export const detectJsonType = (json: unknown): string => {
  if (json === null) return 'null';
  if (Array.isArray(json)) return 'array';
  return typeof json;
};

interface JsonAnalysis {
  type: string;
  size: number;
  keyCount?: number;
  arrayLength?: number;
}

export const analyzeJson = (json: unknown): JsonAnalysis => {
  const type = detectJsonType(json);
  const result: JsonAnalysis = { type, size: JSON.stringify(json).length };

  if (type === 'object' && json !== null) {
    const keys = Object.keys(json as Record<string, unknown>);
    result.keyCount = keys.length;
  } else if (type === 'array') {
    result.arrayLength = (json as unknown[]).length;
  }

  return result;
};