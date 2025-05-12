import {
  SignUpRequest,
  signUpSchema,
  ConfirmAccountRequest,
  confirmAccountSchema,
  ResendConfirmAccountRequest,
  resendConfirmAccountSchema,
  SignInRequest,
  signInValidationSchema,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/features/auth/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates signup request body
 * @param   {SignUpRequest} req - Request with signup data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateSignUp = asyncHandler(
  async (req: SignUpRequest, _res, next) => {
    const { body } = req;
    await signUpSchema.parseAsync(body);
    next();
  },
);

/**
 * @desc    Validates account confirmation request body
 * @param   {ConfirmAccountRequest} req - Request with email and confirmation code
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateConfirmAccount = asyncHandler(
  async (req: ConfirmAccountRequest, _res, next) => {
    const { body } = req;
    await confirmAccountSchema.parseAsync(body);
    next();
  },
);

/**
 * @desc    Validates resend verification code request body
 * @param   {ResendVerificationRequest} req - Request with email
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateResendConfirmAccount = asyncHandler(
  async (req: ResendConfirmAccountRequest, _res, next) => {
    const { body } = req;
    await resendConfirmAccountSchema.parseAsync(body);
    next();
  },
);

/**
 * @desc    Validates signin request body
 * @param   {SignInRequest} req - Request with signin credentials
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateSignIn = asyncHandler(
  async (req: SignInRequest, _res, next) => {
    await signInValidationSchema.parseAsync(req.body);
    next();
  },
);

/**
 * @desc    Validates forgot password request body
 * @param   {ForgotPasswordRequest} req - Request with email
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateForgotPassword = asyncHandler(
  async (req: ForgotPasswordRequest, _res, next) => {
    const { body } = req;
    await forgotPasswordSchema.parseAsync(body);
    next();
  },
);

/**
 * @desc    Validates reset password request body
 * @param   {ResetPasswordRequest} req - Request with email, code and new password
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateResetPassword = asyncHandler(
  async (req: ResetPasswordRequest, _res, next) => {
    const { body } = req;
    await resetPasswordSchema.parseAsync(body);
    next();
  },
);
