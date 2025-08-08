import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).send({ error: 'Token no proporcionado' })
    }

    const idToken = authHeader.replace('Bearer ', '')

    try {
      // validar token jwt aquí
      console.log('Validando token...')
      console.log('Token:', idToken)
      return await next()
    } catch (error) {
      console.error('Error validando token:', error)
      return ctx.response.status(401).send({ error: 'Token inválido o expirado' })
    }
  }
}
