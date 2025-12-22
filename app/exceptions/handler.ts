import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as mailErrors } from '@adonisjs/mail'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { errors } from '@adonisjs/core'
import { errors as bouncerErrors } from '@adonisjs/bouncer'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof mailErrors.E_MAIL_TRANSPORT_ERROR) {
      console.log(error.cause)
      return ctx.response.badRequest({
        status: 'Not found',
        message: `${error.cause || error.message} ${error.message}`,
        statusCode: 404,
      })
    }

    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.notFound({
        status: 'Not found',
        message: `${error.model?.name || 'Row'} not found`,
        statusCode: 404,
      })
    }
    if (error instanceof errors.E_ROUTE_NOT_FOUND) {
      // handle error
      return ctx.response.notFound({
        status: 'Not Found',
        message: 'Route/Method does not exist',
        statusCode: 404,
      })
    }

    if (error instanceof bouncerErrors.E_AUTHORIZATION_FAILURE) {
      return ctx.response.status(403).json({
        status: 'Forbidden',
        statusCode: 403,
        message: 'Access denied: You do not have permission to access this resource.',
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
