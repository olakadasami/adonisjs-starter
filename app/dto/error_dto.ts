import { ApiProperty } from '@foadonis/openapi/decorators'

export class Project403ResponseDto {
  @ApiProperty({
    type: String,
    example: 'Project is not publicly accessible',
    description: 'Trying to access an unauthorized route',
  })
  declare error: string
}

export class BadRequestResponseDto {
  @ApiProperty({
    type: String,
    example: 'Invalid details',
    description: 'The provided details are invalid',
  })
  declare message: string
}
