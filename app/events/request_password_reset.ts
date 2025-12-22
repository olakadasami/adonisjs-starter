import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class RequestPasswordReset extends BaseEvent {
  constructor(public userId: User['id']) {
    super()
  }
}
