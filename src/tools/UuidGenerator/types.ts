export type UuidType = 
  | 'v1'
  | 'v3'
  | 'v4'
  | 'v5'
  | 'ulid'
  | 'objectId'
  | 'nano';

export const UUID_TYPES: UuidType[] = [
  'v1',
  'v3',
  'v4',
  'v5',
  'ulid',
  'objectId',
  'nano'
];