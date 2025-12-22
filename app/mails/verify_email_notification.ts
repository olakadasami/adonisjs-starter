import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  from = env.get('SMTP_USERNAME')
  subject = 'Please verify your email'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    const path = router.makeUrl('api.v1.auth.verifyEmail', { token: this.token })
    const domain = env.get('APP_URL')
    const url = domain + path
    this.message.to(this.user.email).htmlView('emails/verify', { url, user: this.user })
  }
}
