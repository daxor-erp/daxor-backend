import { createHash } from 'crypto';

/**
 * Generates a unique alphanumeric string of specified length based on the input string
 * @param input String to generate the unique ID from (e.g., organization name or ID)
 * @param length Length of the alphanumeric string to generate (default: 3)
 * @returns Alphanumeric string of specified length
 */
export const generateUniqueAlphanumeric = (
  input: string,
  length: number = 3,
): string => {
  // Create a hash of the input string
  const hash = createHash('md5').update(input).digest('hex');

  // Convert the hash to an alphanumeric string (remove any non-alphanumeric characters)
  // and take the first 'length' characters
  return hash
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, length);
};

/**
 * Creates a formatted sequence number for an entity
 * Format: {EntityPrefix}-{OrgPrefix}-{UniqueId}{Sequence}
 * Example: U-DAX-ABC001 (User, Daxor, ABC, 001)
 *
 * @param entityPrefix Prefix for the entity (e.g., 'U' for User, 'I' for Invoice)
 * @param orgName Organization name
 * @param sequence Sequence number
 * @returns Formatted sequence number
 */
export const formatEntitySequence = (
  entityPrefix: string,
  orgName: string,
  sequence: string,
): string => {
  const orgPrefix = orgName.slice(0, 3).toUpperCase();
  const uniqueId = generateUniqueAlphanumeric(orgName);

  return `${entityPrefix}-${orgPrefix}-${uniqueId}${sequence.padStart(3, '0')}`;
};
