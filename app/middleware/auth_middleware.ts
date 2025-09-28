import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Leer los headers establecidos por el API Gateway
    const userId = ctx.request.header('X-User-ID')
    const siteId = ctx.request.header('X-Site-ID')

    if (!userId || !siteId) {
      return ctx.response.status(401).send({ error: 'Usuario no autenticado' })
    }

    try {
      // Buscar el usuario en la base de datos
      const user = await User.firstOrCreate({ authId: userId, siteId: siteId })

      // Agregar el usuario y siteId al contexto
      ctx.user = user
      ctx.siteId = siteId

      return await next()
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return ctx.response.status(500).send({ error: 'Error interno del servidor' })
    }
  }
}
