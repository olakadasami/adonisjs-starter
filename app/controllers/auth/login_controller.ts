import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { AuthResponseDto } from '../../dto/auth_dto.js'

export default class LoginController {
  @ApiOperation({
    summary: 'Login a user',
    tags: ['Auth'],
  })
  @ApiBody({ type: () => loginValidator })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return {
      message: 'Login success',
      statusCode: 200,
      data: {
        user,
        accessToken: token.toJSON().token,
      },
    }
  }
}
