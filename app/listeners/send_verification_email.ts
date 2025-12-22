import Token from '#models/token'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import Mails from '../enums/mails.js'
import logger from '@adonisjs/core/services/logger'
// import Roles from '#enums/role'
import VerifyEmailNotification from '#mails/verify_email_notification'

export default class SendVerificationEmail {
  async handle(payload: { userId: User['id'] }) {
    const user = await User.findOrFail(payload.userId)

    const token = await Token.generateToken(user, Mails.VERIFY_EMAIL)

    try {
      await mail.sendLater(new VerifyEmailNotification(user, token))
    } catch (error) {
      logger.error({ err: error }, 'Error Sending Mail')
    }

    // const admins = await User.query().where('roleId', Roles.ADMIN)
    // // Send mail to each admin
    // await Promise.all(
    //   admins.map((admin) => mail.sendLater(new AdminForUserRegisteredNotification(admin, user)))
    // )
  }
}
