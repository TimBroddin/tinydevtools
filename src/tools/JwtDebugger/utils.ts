import { JwtAlgorithm } from './types';

export interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  error?: string;
  isValid?: boolean;
}

const base64UrlDecode = (str: string): string => {
  try {
    const base64 = str
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');

    const decoded = decodeURIComponent(escape(atob(base64)));
    return decoded;
  } catch {
    throw new Error('Invalid base64url string');
  }
};

const base64UrlEncode = (str: string): string => {
  try {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    throw new Error('Invalid string for base64url encoding');
  }
};

async function hmacSign(message: string, secret: string, algorithm: JwtAlgorithm): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const hashAlgorithm = algorithm.replace('HS', 'SHA-') as 'SHA-256' | 'SHA-384' | 'SHA-512';

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: hashAlgorithm },
    false,
    ['sign']
  );

  return crypto.subtle.sign('HMAC', cryptoKey, messageData);
}

async function arrayBufferToBase64Url(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

export const verifyJwt = async (token: string, secret: string, algorithm: JwtAlgorithm): Promise<boolean> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;
    const message = `${headerB64}.${payloadB64}`;
    
    const expectedSignature = await hmacSign(message, secret, algorithm);
    const expectedSignatureB64 = await arrayBufferToBase64Url(expectedSignature);
    
    return signatureB64 === expectedSignatureB64;
  } catch {
    return false;
  }
};

export const encodeJwt = async (header: string, payload: string, secret: string, algorithm: JwtAlgorithm): Promise<string> => {
  try {
    // Validate and parse JSON
    const headerObj = JSON.parse(header);
    const payloadObj = JSON.parse(payload);

    // Update algorithm in header
    headerObj.alg = algorithm;
    
    // Encode header and payload
    const headerB64 = base64UrlEncode(JSON.stringify(headerObj));
    const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
    
    // Create signature
    const message = `${headerB64}.${payloadB64}`;
    const signature = await hmacSign(message, secret, algorithm);
    const signatureB64 = await arrayBufferToBase64Url(signature);
    
    // Combine all parts
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  } catch (error) {
    throw new Error(`Failed to encode JWT: ${(error as Error).message}`);
  }
};

export const decodeJwt = (token: string): JwtParts => {
  try {
    if (!token.trim()) {
      return {
        header: '',
        payload: '',
        signature: '',
      };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const [headerB64, payloadB64, signature] = parts;

    const header = base64UrlDecode(headerB64);
    const payload = base64UrlDecode(payloadB64);

    // Validate JSON parsing
    JSON.parse(header);
    JSON.parse(payload);

    return {
      header: JSON.stringify(JSON.parse(header), null, 2),
      payload: JSON.stringify(JSON.parse(payload), null, 2),
      signature,
    };
  } catch (error) {
    return {
      header: '',
      payload: '',
      signature: '',
      error: (error as Error).message,
    };
  }
};

export const formatJwt = (jwt: string): string => {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return jwt;
    return parts.join('.');
  } catch {
    return jwt;
  }
};