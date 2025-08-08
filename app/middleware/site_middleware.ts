import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SiteMiddleware {
  private googleClientIds: string[]

  constructor() {
    this.googleClientIds = [
      '213131965361-nt6itpml1c9lseihm352j1ab7nmp27k0.apps.googleusercontent.com', // Droni.co
    ]
  }
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const clientId = ctx.request.header('ClientId')
    if (!clientId || !this.googleClientIds.includes(clientId)) {
      return ctx.response.status(401).send({ error: 'Client ID incorrecto' })
    }
    ctx.clientId = clientId
    return await next()
  }
}
