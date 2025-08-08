import vine from '@vinejs/vine'
/**
 * Validates the category creation/update actions
 */
export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().escape().optional(),
    picture: vine.string().trim().optional(),
    parentId: vine.string().uuid().optional(),
  })
)
