import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { LogoutResponseDto } from '#dto/auth_dto'
import { BadRequestResponseDto } from '#dto/error_dto'

export default class LogoutController {
  @ApiOperation({
    summary: 'Logout a User',
    tags: ['Auth'],
    description: 'Deletes Auth token belonging to a user',
  })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  async logout({ response, auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken.identifier
    console.log(request.input('token'))
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }
}
