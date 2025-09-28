import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Env from '#start/env'

export default class SiteMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // if path is swagger or docs, skip this middleware
    if (ctx.request.url().startsWith('/swagger') || ctx.request.url().startsWith('/docs')) {
      return await next()
    }
    const avalableSiteIds = Env.get('AVAILABLE_SITES').split(',')
    const siteId = ctx.request.header('X-Site-ID')
    if (!siteId || !avalableSiteIds.includes(siteId)) {
      return ctx.response.status(400).send({ error: 'Site ID incorrecto o no permitido' })
    }
    ctx.siteId = siteId
    return await next()
  }
}
