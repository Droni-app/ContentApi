import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import drive from '@adonisjs/drive/services/main'

export default class AdminAttachmentsController {
  /**
   * Lista todos los archivos adjuntos del sitio con paginación y búsqueda
   */
  public async index({ siteId, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const q = request.input('q')

    const attachments = await Attachment.query()
      .where('siteId', siteId)
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
  public async destroy({ siteId, params, response }: HttpContext) {
    const attachment = await Attachment.query()
      .where('id', params.id)
      .where('siteId', siteId)
      .firstOrFail()

    // Eliminar el archivo físico
    const disk = drive.use()
    await disk.delete(attachment.path)

    await attachment.delete()
    return response.noContent()
  }
}
