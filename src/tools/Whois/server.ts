import { createServerFn } from '@tanstack/react-start';
import whois from 'whois';
import { z } from 'zod';

export const fetchWhoisData = createServerFn(
  { method: 'POST' },
).validator((payload: { domain: string }) => {
  return z.object({ domain: z.string().min(1) }).parse(payload);
}).handler(async ({ data }) => {
  const { domain } = data;
  if (!domain) {
    throw new Error('Domain is required');
  }

  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err: Error | null, whoisData: string | null) => {
      if (err) {
        reject(new Error(`WHOIS lookup failed: ${err.message}`));
      } else {
        resolve({ data: whoisData });
      }
    });
  });
});
