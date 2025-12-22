import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import { AuthResponseDto } from '../../dto/auth_dto.js'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import UserRegistered from '#events/user_registered'

// Constants for reusability
const SUCCESS_MESSAGE = 'User registered, Check mail to verify user account'

// @inject()
export default class RegisterController {
  //   constructor(protected authService: AuthService) {}

  @ApiOperation({
    summary: 'Registers a user',
    description: 'Creates a new user',
    tags: ['Auth'],
  })
  @ApiBody({ type: () => registerValidator })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register({ request, response }: HttpContext) {
    // Validate Request data
    const data = await request.validateUsing(registerValidator)

    // Perform database operations in a transaction
    const user = await User.create({
      email: data.email,
      password: data.password,
      fullName: data.firstName + ' ' + data.lastName,
    })

    // Generate access token
    const accessToken = await User.accessTokens.create(user)

    // Send email verification
    if (env.get('NODE_ENV') !== 'test') {
      UserRegistered.dispatch(user.id)
    }
    // Log success
    logger.info(`User registered successfully: ${user.email}`)

    // Send response when successful
    return response.created({
      message: SUCCESS_MESSAGE,
      statusCode: 201,
      data: {
        user,
        accessToken: accessToken.toJSON().token,
      },
    })
  }
}
