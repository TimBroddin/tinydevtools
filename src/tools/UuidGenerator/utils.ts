import { v1, v3, v4, v5 } from 'uuid';
import { nanoid } from 'nanoid';

const NAMESPACE_URL = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const increment = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  return timestamp + machineId + processId + increment;
}

export function generateUlid(): string {
  const timestamp = Date.now();
  const timestampPart = timestamp.toString(32).padStart(10, '0');
  const randomPart = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 32).toString(32)
  ).join('');
  return (timestampPart + randomPart).toUpperCase();
}

// Helper function to generate v1 UUIDs with better uniqueness
function generateV1WithDelay(): Promise<string> {
  return new Promise((resolve) => {
    // Add a micro delay to ensure timestamp differences
    setTimeout(() => {
      resolve(v1());
    }, Math.random() * 2); // Random delay up to 2ms
  });
}

export async function generateUuid(type: string, count: number = 1): Promise<string[]> {
  const uuids: string[] = [];
  
  if (type === 'v1' && count > 1) {
    // For v1 UUIDs with multiple generations, use async approach with delays
    for (let i = 0; i < count; i++) {
      const uuid = await generateV1WithDelay();
      uuids.push(uuid);
    }
  } else {
    // For single v1 or other types, use synchronous approach
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'v1':
          uuids.push(v1());
          break;
        case 'v3':
          // Using URL namespace and a unique string for each iteration
          uuids.push(v3(`${Date.now()}-${i}-${Math.random()}`, NAMESPACE_URL));
          break;
        case 'v4':
          uuids.push(v4());
          break;
        case 'v5':
          // Using URL namespace and a unique string for each iteration
          uuids.push(v5(`${Date.now()}-${i}-${Math.random()}`, NAMESPACE_URL));
          break;
        case 'ulid':
          uuids.push(generateUlid());
          break;
        case 'objectId':
          uuids.push(generateObjectId());
          break;
        case 'nano':
          uuids.push(nanoid());
          break;
        default:
          uuids.push(v4());
      }
    }
  }
  
  return uuids;
}