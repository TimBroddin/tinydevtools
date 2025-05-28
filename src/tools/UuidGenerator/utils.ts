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

export function generateUuid(type: string, count: number = 1): string[] {
  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'v1':
        uuids.push(v1());
        break;
      case 'v3':
        // Using URL namespace and a random string for v3
        uuids.push(v3(Date.now().toString(), NAMESPACE_URL));
        break;
      case 'v4':
        uuids.push(v4());
        break;
      case 'v5':
        // Using URL namespace and a random string for v5
        uuids.push(v5(Date.now().toString(), NAMESPACE_URL));
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
  
  return uuids;
}