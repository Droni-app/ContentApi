import vine from '@vinejs/vine'

/**
 * Validador para la creación de un archivo adjunto
 */
export const createAttachmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    file: vine.file({
      size: '10mb',
      extnames: ['jpg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'text', 'markdown'],
    }),
  })
)
