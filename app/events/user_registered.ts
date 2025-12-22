import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class UserRegistered extends BaseEvent {
  constructor(public userId: User['id']) {
    super()
  }
}
