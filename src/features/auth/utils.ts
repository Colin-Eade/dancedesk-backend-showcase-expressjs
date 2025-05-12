import crypto from 'crypto';

/**
 * @desc    Computes the Cognito secret hash for user authentication
 * @param   {string} username - The username/email used in Cognito
 * @returns {string} Base64-encoded HMAC digest
 */
export const computeSecretHash = (username: string) => {
  return crypto
    .createHmac('sha256', String(process.env.COGNITO_CLIENT_SECRET))
    .update(username + String(process.env.COGNITO_CLIENT_ID))
    .digest('base64');
};
