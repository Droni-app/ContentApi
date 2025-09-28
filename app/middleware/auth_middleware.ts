import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

interface GoogleUserInfo {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  hd?: string
}

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Leer el access token del header Authorization
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).send({ error: 'Token de autorización no proporcionado' })
    }

    const accessToken = authHeader.substring(7) // Remover 'Bearer ' del token

    try {
      // Validar el access token con Google
      const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        return ctx.response.status(401).send({ error: 'Token de acceso inválido' })
      }

      const userInfo = (await response.json()) as GoogleUserInfo

      if (!userInfo.sub || !userInfo.hd) {
        return ctx.response
          .status(401)
          .send({ error: 'Token no contiene información de usuario válida' })
      }

      // Buscar el usuario en la base de datos
      const user = await User.firstOrCreate({
        authId: userInfo.sub,
        siteId: userInfo.hd,
        name: userInfo.name,
        email: userInfo.email,
      })

      // Agregar el usuario y siteId al contexto
      ctx.user = user
      ctx.siteId = userInfo.hd

      return await next()
    } catch (error) {
      console.error('Error validando token o obteniendo usuario:', error)
      return ctx.response.status(500).send({ error: 'Error interno del servidor' })
    }
  }
}
