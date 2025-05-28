export type JwtAlgorithm = 
  | 'HS256' 
  | 'HS384' 
  | 'HS512';

export const JWT_ALGORITHMS: JwtAlgorithm[] = [
  'HS256',
  'HS384',
  'HS512',
];