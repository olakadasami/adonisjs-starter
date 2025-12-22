import Mails from '#enums/mails'
import RequestPasswordReset from '#events/request_password_reset'
import Token from '#models/token'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

export default class PasswordResetController {
  @ApiOperation({
    summary: 'Password Reset Request',
    description: 'User forgets password',
    tags: ['Auth'],
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'example@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        message: 'User not found',
      },
    },
    description: 'User does not exist',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Password reset email sent',
      },
    },
    description: 'Password reset email sent',
  })
  async requestPasswordReset({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findByOrFail('email', email)

    // Send Email
    RequestPasswordReset.dispatch(user.id) // New way using events

    return response.ok({ message: 'Password reset email added to queue' })
  }

  async passwordResetForm({ params, view }: HttpContext) {
    return view.render('auth/password_reset_form', {
      token: params.token,
    })
  }

  // Password Reset Execution
  @ApiOperation({
    summary: 'Password Reset Execution',
    description: 'User adds gives new password',
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
        message: 'Password reset successful',
      },
    },
    description: 'Password reset successful',
  })
  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    // GEt user from token
    const user = await Token.getUser(token)
    if (!user) {
      return response.badRequest({ message: 'Invalid or Expired Token' })
    }
    // Update password
    user.password = password
    await user.save()

    // Delete tokens
    await Token.deleteTokens(user, Mails.PASSWORD_RESET)

    return response.ok({ message: 'Password reset successful' })
  }
}
