import { createHash } from 'crypto';

export const sha256Hash = (input: string) => {
  return createHash('sha256').update(input).digest('hex');
}
