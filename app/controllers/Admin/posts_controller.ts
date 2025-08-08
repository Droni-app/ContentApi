import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator } from '#validators/Admin/post'
import string from '@adonisjs/core/helpers/string'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ clientId, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const q = request.input('q', '')
    const posts = await Post.query()
      .where('clientId', clientId)
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .if(q, (query) => {
        query.where('name', 'LIKE', `%${q}%`).orWhere('description', 'LIKE', `%${q}%`)
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
    return posts
  }

  /**
   * Handle form submission for the create action
   */
  async store({ clientId, user, request }: HttpContext) {
    const payload = await createPostValidator.validate(request.body())
    const existsSlug = await Post.query()
      .where('clientId', clientId)
      .where('slug', string.slug(payload.name))
      .first()
    const slug = existsSlug
      ? `${string.slug(payload.name)}-${Date.now()}`
      : string.slug(payload.name)
    const post = await Post.create({
      ...payload,
      slug,
      clientId,
      userId: user.id, // Assuming the user is authenticated and available in the context
    })
    return post
  }

  /**
   * Show individual record
   */
  async show({ clientId, params }: HttpContext) {
    const post = await Post.query()
      .where('clientId', clientId)
      .where('id', params.id)
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .firstOrFail()
    return post
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ clientId, params, request }: HttpContext) {
    const payload = await createPostValidator.validate(request.body())
    const post = await Post.query().where('clientId', clientId).where('id', params.id).firstOrFail()

    post.merge({
      ...payload,
    })
    await post.save()
    return post
  }

  /**
   * Delete record
   */
  async destroy({ clientId, params }: HttpContext) {
    const post = await Post.query().where('clientId', clientId).where('id', params.id).firstOrFail()
    await post.delete()
    return post
  }
}
