import vine from '@vinejs/vine'
/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(6),
    description: vine.string().trim().escape(),
    picture: vine.string().trim().optional(),
    content: vine.string().trim().escape().optional(),
    format: vine.enum(['markdown', 'html']).optional(),
    active: vine.boolean().optional(),
    categories: vine
      .array(
        vine.object({
          id: vine.string().uuid(),
        })
      )
      .optional(),
  })
)
