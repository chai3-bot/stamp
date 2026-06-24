import { z } from 'zod';

export const MAX_LOOKUP_ADDRESSES = 50;
export const MAX_RESOLVE_NAMES = 5;

// Accepts both EVM and Starknet addresses.
export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'must be a valid address')
  .or(z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'must be a valid address'))
  .brand('Address');

export type ValidatedAddress = z.infer<typeof addressSchema>;

export const handleSchema = z
  .string()
  .regex(/^[^\s]*\.[^\s]*$/, 'must be a valid handle')
  .brand('Handle');

export type ValidatedHandle = z.infer<typeof handleSchema>;

export const lookupAddressesSchema = z
  .array(addressSchema)
  .min(1, 'params must contain at least one address')
  .max(MAX_LOOKUP_ADDRESSES, `params must contain less than ${MAX_LOOKUP_ADDRESSES} items`);

export const resolveNamesSchema = z
  .array(handleSchema)
  .min(1, 'params must contain at least one name')
  .max(MAX_RESOLVE_NAMES, `params must contain less than ${MAX_RESOLVE_NAMES} items`);

// lookup_domains is EVM-only.
export const lookupDomainsSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'params must be a valid address')
  .brand('Address');

export const getOwnerSchema = z
  .string()
  .regex(/^[^\s]*\.[^\s]*$/, 'params must be a valid handle')
  .brand('Handle');

// Avatar ids can be either addresses or handles.
export const avatarIdSchema = z.union([addressSchema, handleSchema]);

export type AvatarId = z.infer<typeof avatarIdSchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map(issue => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');
}
