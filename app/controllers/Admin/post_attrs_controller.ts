import type { HttpContext } from '@adonisjs/core/http'
import Attr from '#models/attr'
import Post from '#models/post'
import { createPostAttrValidator } from '#validators/Admin/post_attr'

export default class AdminPostAttrsController {
  /**
   * @store
   * @tag Admin_Posts_Attrs
   * @operationId adminCreatePostAttr
   * @summary Creates a new post attribute
   * @responseBody 201 - <Attr>
   */
  async store({ siteId, request, params }: HttpContext) {
    const post = await Post.query()
      .where('siteId', siteId)
      .where('id', params.post_id)
      .firstOrFail()
    const payload = await createPostAttrValidator.validate(request.body())
    const attr = await Attr.create({
      ...payload,
      postId: post.id,
    })
    return attr
  }
  /**
   * @destroy
   * @tag Admin_Posts_Attrs
   * @operationId adminDeletePostAttr
   * @summary Deletes a post attribute
   * @responseBody 200 - <Attr>
   */
  async destroy({ siteId, params }: HttpContext) {
    const post = await Post.query()
      .where('siteId', siteId)
      .where('id', params.post_id)
      .firstOrFail()
    const attr = await Attr.query().where('postId', post.id).where('id', params.id).firstOrFail()
    await attr.delete()
    return attr
  }
}
