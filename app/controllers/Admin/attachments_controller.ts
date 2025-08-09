import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import drive from '@adonisjs/drive/services/main'

export default class AdminAttachmentsController {
  /**
   * Lista todos los archivos adjuntos del sitio con paginación y búsqueda
   */
  public async index({ clientId, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const q = request.input('q')

    const attachments = await Attachment.query()
      .where('clientId', clientId)
      .if(q, (qB) => {
        qB.whereILike('name', `%${q}%`)
      })
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
    return response.ok(attachments)
  }

  /**
   * Elimina un archivo adjunto
   */
  public async destroy({ clientId, params, response }: HttpContext) {
    const attachment = await Attachment.query()
      .where('id', params.id)
      .where('clientId', clientId)
      .firstOrFail()

    // Eliminar el archivo físico
    const disk = drive.use()
    await disk.delete(attachment.path)

    await attachment.delete()
    return response.noContent()
  }
}
