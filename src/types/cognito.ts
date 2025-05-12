import { MemberRole } from '@prisma/client';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

export interface CustomAccessTokenPayload extends CognitoAccessTokenPayload {
  memberId: string;
  organizationId: string;
  role: MemberRole;
  'cognito:groups': string[];
}
