import User from '#models/user'
import { ApiProperty } from '@foadonis/openapi/decorators'

export class LoginRequestDto {
  @ApiProperty({ type: 'string', format: 'email', example: 'user@example.com' })
  declare email: string

  @ApiProperty({ type: 'string', example: 'password123' })
  declare password: string
}

class DataDto {
  @ApiProperty({ type: User })
  declare user: User

  @ApiProperty({ type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  declare accessToken: string
}

export class AuthResponseDto {
  @ApiProperty({ type: 'string', example: 'Login success' })
  declare message: string

  @ApiProperty({ type: 'number', example: 200 })
  declare statusCode: number

  @ApiProperty({
    type: DataDto,
  })
  declare data: DataDto
}

export class LogoutResponseDto {
  @ApiProperty({ type: 'string', example: 'Logged out' })
  declare message: string
}
