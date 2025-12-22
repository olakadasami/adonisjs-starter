/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'
import { HttpContext } from '@adonisjs/core/http'
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
import { middleware } from './kernel.js'
const PasswordResetController = () => import('#controllers/auth/password_reset_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const VerifyEmailController = () => import('#controllers/auth/verify_email_controller')

openapi.registerRoutes()

router.get('/docs', async (ctx: HttpContext) => {
  // return ctx.response.send(openapi.generateUi('/api.json'))
  return ctx.response.redirect('/api')
})

router
  .group(() => {
    /**
     * API Version 1
     */
    router
      .group(() => {
        /**
         * Auth Routes
         */
        router
          .group(() => {
            router.post('/login', [LoginController, 'login']).as('login').as('login')
            router.post('/register', [RegisterController, 'register']).as('register').as('register')
            router.post('/logout', [LogoutController, 'logout']).as('logout').use(middleware.auth())

            router
              .post('forgot-password', [PasswordResetController, 'requestPasswordReset'])
              .as('forgotPassword')

            // Reset password Form
            router
              .get('/reset-password/:token', [PasswordResetController, 'passwordResetForm'])
              .as('resetPasswordForm')

            // REset password handler
            router
              .post('reset-password', [PasswordResetController, 'resetPassword'])
              .as('resetPassword')
            router
              .get('verify/email/request', [VerifyEmailController, 'requestEmailVerification'])
              .as('request.verifyEmail')
            router
              .get('verify/email/:token', [VerifyEmailController, 'verifyEmail'])
              .as('verifyEmail')
          })
          .prefix('auth')
          .as('auth')
      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')
