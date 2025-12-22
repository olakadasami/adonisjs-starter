import Token from '#models/token'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import Mails from '../enums/mails.js'
import ResetPasswordNotification from '#mails/reset_password_notification'

export default class SendPasswordResetEmail {
  async handle(payload: { userId: User['id'] }) {
    const user = await User.findOrFail(payload.userId)

    const token = await Token.generateToken(user, Mails.PASSWORD_RESET)

    try {
      await mail.sendLater(new ResetPasswordNotification(user, token))
    } catch (error) {
      logger.error({ err: error }, 'Error Sending Mail')
    }
  }
}
