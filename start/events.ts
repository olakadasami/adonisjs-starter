import RequestPasswordReset from '#events/request_password_reset'
import UserRegistered from '#events/user_registered'
const SendPasswordResetEmail = () => import('#listeners/send_password_reset_email')
const SendVerificationEmail = () => import('#listeners/send_verification_email')
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('queued:mail:error', (event) => {
  logger.error({ mailer: event.mailerName, error: event.error })
})

emitter.on(UserRegistered, [SendVerificationEmail])
emitter.on(RequestPasswordReset, [SendPasswordResetEmail])
