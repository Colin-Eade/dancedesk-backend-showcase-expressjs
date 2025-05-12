import { Router } from 'express';
import {
  signUp,
  verifyEmail,
  resendVerificationCode,
  signIn,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '@/features/auth/controllers';
import {
  validateConfirmAccount,
  validateForgotPassword,
  validateResendConfirmAccount,
  validateResetPassword,
  validateSignIn,
  validateSignUp,
} from '@/features/auth/middleware';

const router = Router();

router
  .route('/signup')
  /**
   * @route   POST /api/auth/signup
   * @desc    Register a new user
   * @access  Public
   */
  .post(validateSignUp, signUp);

router
  .route('/confirm-account')
  /**
   * @route   POST /api/auth/confirm-account
   * @desc    Confirm user account with confirmation code
   * @access  Public
   */
  .post(validateConfirmAccount, verifyEmail);

router
  .route('/confirm-account/resend')
  /**
   * @route   POST /api/auth/confirm-account/resend
   * @desc    Resend account confirmation code
   * @access  Public
   */
  .post(validateResendConfirmAccount, resendVerificationCode);

router
  .route('/signin')
  /**
   * @route   POST /api/auth/signin
   * @desc    Authenticate user & get tokens
   * @access  Public
   */
  .post(validateSignIn, signIn);

router
  .route('/refresh')
  /**
   * @route   POST /api/auth/refresh
   * @desc    Refresh access token using refresh token
   * @access  Private
   */
  .post(refreshToken);

router
  .route('/forgot-password')
  /**
   * @route   POST /api/auth/forgot-password
   * @desc    Send password reset code
   * @access  Public
   */
  .post(validateForgotPassword, forgotPassword);

router
  .route('/reset-password')
  /**
   * @route   POST /api/auth/reset-password
   * @desc    Reset password with code
   * @access  Public
   */
  .post(validateResetPassword, resetPassword);

export default router;
