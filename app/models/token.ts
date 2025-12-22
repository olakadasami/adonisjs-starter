import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'
import Mails from '#enums/mails'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  static async generateToken(user: User | null, type: Mails | null) {
    const token = stringHelpers.generateRandom(64)

    if (!user || !type) return token

    await Token.deleteTokens(user, type)
    const record = await user.related('tokens').create({
      type,
      expiresAt: Mails.PASSWORD_RESET
        ? DateTime.now().plus({ hour: 1 }) // Password reset is one hour
        : DateTime.now().plus({ day: 1 }), // Verify email is One day
      token,
    })

    return record.token
  }

  static async deleteTokens(user: User, type: Mails | null) {
    if (type === Mails.PASSWORD_RESET) {
      await user.related('passwordResetTokens').query().delete()
    } else if (type === Mails.VERIFY_EMAIL) {
      await user.related('verifyEmailTokens').query().delete()
    } else {
      await user.related('tokens').query().delete()
    }
  }

  static async getUser(token: string) {
    const record = await Token.query()
      .preload('owner')
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.owner
  }

  static async verify(token: string) {
    const record = await Token.query()
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .first()

    return !!record
  }
}
