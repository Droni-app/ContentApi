import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import { createAttachmentValidator } from '#validators/attachment'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

export default class AttachmentsController {
  /**
   * @index
   * @tag Attachments
   * @operationId getAttachments
   * @summary Returns list of paginated attachments for user
   * @responseBody 200 - <Attachment[]>.paginated(data, meta)
   */
  public async index({ user, siteId, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const q = request.input('q')

    const attachments = await Attachment.query()
      .where('siteId', siteId)
      .where('userId', user.id)
      .if(q, (qB) => {
        qB.whereILike('name', `%${q}%`)
      })
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    return attachments
  }
  /**
   * @store
   * @tag Attachments
   * @operationId createAttachment
   * @summary Creates a new attachment
   * @responseBody 201 - <Attachment>
   */
  public async store({ user, siteId, request }: HttpContext) {
    // Validar nombre si se proporciona
    const payload = await request.validateUsing(createAttachmentValidator)

    // validar el limite de almacenamiento para el usuario obteniedo la suma de los archivos
    const sumSize = await db
      .from('attachments')
      .where('user_id', user!.id)
      .sum('size as totalSize')
      .first()

    if (sumSize.totalSize > 100000000) {
      throw new Error('Storage limit exceeded')
    }

    // Generar ruta única por sitio y usuario
    const path = `${siteId}/${user!.id}/${payload.file.size}-${string.slug(payload.file.clientName)}`

    // store file
    await payload.file.moveToDisk(path)

    // Crear el registro en la base de datos
    const attachment = await Attachment.create({
      siteId: siteId,
      userId: user!.id,
      name: payload.name ?? payload.file.clientName,
      path: payload.file.meta?.path ?? path,
      size: payload.file.size,
      mime: payload.file.type ?? payload.file.subtype,
    })

    return attachment
  }
  /**
   * @destroy
   * @tag Attachments
   * @operationId deleteAttachment
   * @summary Deletes a attachment by id
   * @responseBody 200 - <Attachment>
   */
  public async destroy({ user, siteId, params }: HttpContext) {
    const attachment = await Attachment.query()
      .where('id', params.id)
      .where('siteId', siteId)
      .where('userId', user.id)
      .firstOrFail()

    // Eliminar el archivo físico
    const disk = drive.use()
    await disk.delete(attachment.path)

    await attachment.delete()
    return attachment
  }
}
