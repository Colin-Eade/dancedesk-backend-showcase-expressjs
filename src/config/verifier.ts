import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: String(process.env.COGNITO_USER_POOL_ID),
  tokenUse: 'access' as const,
  clientId: String(process.env.COGNITO_CLIENT_ID),
});

export default verifier;
