import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class ResetPasswordNotification extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  from = env.get('SMTP_USERNAME')
  subject = 'Password Reset Requested'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    const path = router.makeUrl('api.v1.auth.resetPasswordForm', { token: this.token })
    const domain = env.get('APP_URL')
    const url = domain + path
    this.message.to(this.user.email).htmlView('mails/reset_password', { url, user: this.user })
  }
}
