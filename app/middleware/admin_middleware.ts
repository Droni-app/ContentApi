import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // Verificar el ID Token de Google con múltiples audience (Client IDs)
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        return ctx.response.status(403).send({ error: 'Acceso denegado.' })
      }
      return await next()
    } catch (error) {
      console.error('Error validando token de Google:', error)
      return ctx.response.status(401).send({ error: 'Token inválido o expirado' })
    }
  }
}
