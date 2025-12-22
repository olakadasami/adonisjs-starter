import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Token from '#models/token'
import { ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import Mails from '#enums/mails'
import UserRegistered from '#events/user_registered'

export default class VerifyEmailController {
  @ApiOperation({
    summary: 'Email Verification request',
    description: 'Authenticated user manually requests email verification',
    tags: ['Auth'],
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        message: 'Email already verified',
      },
    },
    description: 'Email already verified',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Verification email sent',
      },
    },
    description: 'Verification email sent',
  })
  async requestEmailVerification({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.emailVerifiedAt) {
      return response.badRequest({ message: 'Email already verified' })
    }

    // Send Email
    UserRegistered.dispatch(user.id)

    return response.ok({ message: 'Verification email sent' })
  }

  // Email Verification Execution
  @ApiOperation({
    summary: 'Email Verification execution',
    tags: ['Auth'],
    description:
      'Email Verification execution, from Users mail - User clicks the verify button in their mail',
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        message: 'Invalid or Expired Token',
      },
    },
    description: 'Invalid or Expired Token',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Email verified successfully',
      },
    },
    description: 'Email verified successfully',
  })
  @ApiParam({
    name: 'token',
    example: 'KZbT0PPHLpwozmttmciYcy78AedYhiKaOOvww9VLXD2ptYvEIgIChCDNm2AdjQkx',
    required: true,
  })
  async verifyEmail({ response, params }: HttpContext) {
    // Get token from request params
    const { token } = params

    // GEt user from token
    const user = await Token.getUser(token)
    if (!user) {
      return response.badRequest({ message: 'Invalid or Expired Token' })
    }

    // Update emailVerifiedAt
    user.emailVerifiedAt = DateTime.now()
    await user.save()

    // Delete emailVerification tokens
    await Token.deleteTokens(user, Mails.VERIFY_EMAIL)

    return response.ok({ message: 'Email verified successfully' })
  }
}
