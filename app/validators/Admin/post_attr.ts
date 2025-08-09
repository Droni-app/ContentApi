import vine from '@vinejs/vine'
/**
 * Validates the creation of an attribute for a Post
 */
export const createPostAttrValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).escape(),
    type: vine.string().trim().minLength(1).escape(),
    value: vine.string().trim().escape(),
  })
)
