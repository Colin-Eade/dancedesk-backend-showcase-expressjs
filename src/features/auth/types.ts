import { Request } from 'express';
import { z } from 'zod';

const emailValidationSchema = z
  .string({ required_error: 'Email address is required.' })
  .email('Email address must be a valid format (e.g., example@domain.com).');

const passwordValidationSchema = z
  .string({ required_error: 'Password is required.' })
  .min(8, 'Password must be at least 8 characters long.')
  // Contains at least 1 number, 1 special character, 1 uppercase letter, 1 lowercase letter
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.',
  );
const code = z.string().length(6).regex(/^\d+$/);

export const signUpSchema = z
  .object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    organizationName: z.string().min(1),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const confirmAccountSchema = z
  .object({
    email: emailValidationSchema,
    code,
  })
  .strict();

export const resendConfirmAccountSchema = z
  .object({
    email: emailValidationSchema,
  })
  .strict();

export type SignInMutateDTO = z.infer<typeof signInValidationSchema>;

export const signInValidationSchema = z
  .object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
  })
  .strict({ message: 'Request contains unexpected fields.' });

export const forgotPasswordSchema = z
  .object({
    email: emailValidationSchema,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email: emailValidationSchema,
    code,
    password: passwordValidationSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export interface SignUpRequest extends Request {
  body: z.infer<typeof signUpSchema>;
}

export interface ConfirmAccountRequest extends Request {
  body: z.infer<typeof confirmAccountSchema>;
}

export interface ResendConfirmAccountRequest extends Request {
  body: z.infer<typeof resendConfirmAccountSchema>;
}

export interface SignInRequest extends Request {
  body: SignInMutateDTO;
}

export interface ForgotPasswordRequest extends Request {
  body: z.infer<typeof forgotPasswordSchema>;
}

export interface ResetPasswordRequest extends Request {
  body: z.infer<typeof resetPasswordSchema>;
}
