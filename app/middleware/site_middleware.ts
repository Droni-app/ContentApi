import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SiteMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const siteId = ctx.request.header('X-Site-ID')
    if (!siteId) {
      return ctx.response.status(400).send({ error: 'Site ID incorrecto' })
    }
    ctx.siteId = siteId
    return await next()
  }
}
