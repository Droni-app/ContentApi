import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async me({ user }: HttpContext) {
    return user
  }
}
