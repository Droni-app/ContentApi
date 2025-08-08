import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { OAuth2Client } from 'google-auth-library'
import User from '#models/user'

export default class AuthMiddleware {
  private googleClient: OAuth2Client
  private googleClientIds: string[]

  constructor() {
    this.googleClient = new OAuth2Client()
    this.googleClientIds = [
      '213131965361-nt6itpml1c9lseihm352j1ab7nmp27k0.apps.googleusercontent.com', // Droni.co
    ]
  }

  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).send({ error: 'Token no proporcionado' })
    }

    const idToken = authHeader.replace('Bearer ', '')

    try {
      // Verificar el ID Token de Google con múltiples audience (Client IDs)
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: this.googleClientIds,
      })

      const payload = ticket.getPayload()

      if (!payload) {
        return ctx.response.status(401).send({ error: 'Token inválido' })
      }

      const user = await User.updateOrCreate(
        {
          email: payload.email!,
          clientId: payload.aud!,
        },
        {
          clientId: payload.aud!,
          name: payload.name!,
          email: payload.email!,
          avatar: payload.picture || null,
        }
      )
      ctx.user = user

      return await next()
    } catch (error) {
      console.error('Error validando token de Google:', error)
      return ctx.response.status(401).send({ error: 'Token inválido o expirado' })
    }
  }
}
