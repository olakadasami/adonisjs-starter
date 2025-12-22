import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { uuidv7 } from 'uuidv7'
import Role from './role.js'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Token from './token.js'
import Mails from '#enums/mails'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @column({ isPrimary: true })
  declare id: string

  @ApiProperty({ type: 'number', example: 1 })
  @column()
  declare roleId: number

  @ApiProperty({ type: 'string', nullable: true, example: 'John Doe' })
  @column()
  declare fullName: string | null

  @ApiProperty({ type: 'string', format: 'email', example: 'john.doe@example.com' })
  @column()
  declare email: string

  @ApiProperty({ type: 'string', format: 'password' })
  @column({ serializeAs: null })
  declare password: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  @column()
  declare emailVerifiedAt: DateTime | null

  @ApiProperty({ type: 'string', format: 'date-time', example: '2024-01-01T00:00:00Z' })
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
    example: '2024-01-02T00:00:00Z',
  })
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => Token)
  declare tokens: HasMany<typeof Token>

  @hasMany(() => Token, { onQuery: (query) => query.where('type', Mails.PASSWORD_RESET) })
  declare passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, { onQuery: (query) => query.where('type', Mails.VERIFY_EMAIL) })
  declare verifyEmailTokens: HasMany<typeof Token>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static assignUuid(model: User) {
    model.id = uuidv7()
  }
}
