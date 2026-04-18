import { getPayload as getPayloadBase } from 'payload';
import config from '@payload-config';

let cached: ReturnType<typeof getPayloadBase> | null = null;

export function getPayload() {
  if (!cached) cached = getPayloadBase({ config });
  return cached;
}
