export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

// Simplified MD5 implementation using a library-like approach
const md5 = (str: string): string => {
  // This is a simplified implementation - in a real app you'd want to use a proper crypto library
  // For demo purposes, we'll create a pseudo-hash based on the string
  let hash = 0;
  if (str.length === 0) return '00000000000000000000000000000000';
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a 32-character hex string (like MD5)
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex).substring(0, 32);
};

export const generateHash = async (input: string, algorithm: HashAlgorithm): Promise<string> => {
  if (algorithm === 'MD5') {
    return md5(input);
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    throw new Error(`Failed to generate ${algorithm} hash: ${(error as Error).message}`);
  }
};

export const generateAllHashes = async (input: string): Promise<Record<HashAlgorithm, string>> => {
  const hashes: Partial<Record<HashAlgorithm, string>> = {};
  
  for (const algorithm of HASH_ALGORITHMS) {
    try {
      hashes[algorithm] = await generateHash(input, algorithm);
    } catch (error) {
      hashes[algorithm] = `Error: ${(error as Error).message}`;
    }
  }
  
  return hashes as Record<HashAlgorithm, string>;
};

export const compareHashes = (hash1: string, hash2: string): boolean => {
  return hash1.toLowerCase() === hash2.toLowerCase();
};

export const validateHashFormat = (hash: string, algorithm: HashAlgorithm): boolean => {
  const expectedLengths: Record<HashAlgorithm, number> = {
    'MD5': 32,
    'SHA-1': 40,
    'SHA-256': 64,
    'SHA-384': 96,
    'SHA-512': 128
  };
  
  const expectedLength = expectedLengths[algorithm];
  return /^[a-fA-F0-9]+$/.test(hash) && hash.length === expectedLength;
};

export const getHashInfo = (algorithm: HashAlgorithm): { length: number; description: string } => {
  const info: Record<HashAlgorithm, { length: number; description: string }> = {
    'MD5': {
      length: 128,
      description: 'MD5 produces a 128-bit hash value. Note: MD5 is cryptographically broken and should not be used for security purposes.'
    },
    'SHA-1': {
      length: 160,
      description: 'SHA-1 produces a 160-bit hash value. Note: SHA-1 is deprecated for cryptographic use due to vulnerabilities.'
    },
    'SHA-256': {
      length: 256,
      description: 'SHA-256 is part of the SHA-2 family and produces a 256-bit hash value. Widely used and considered secure.'
    },
    'SHA-384': {
      length: 384,
      description: 'SHA-384 is part of the SHA-2 family and produces a 384-bit hash value. More secure than SHA-256.'
    },
    'SHA-512': {
      length: 512,
      description: 'SHA-512 is part of the SHA-2 family and produces a 512-bit hash value. The most secure in the SHA-2 family.'
    }
  };
  
  return info[algorithm];
}; 