import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator } from '#validators/Admin/post'
import string from '@adonisjs/core/helpers/string'
import Category from '#models/category'

export default class AdminPostsController {
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

    // Validar categorías por clientId
    if (payload.categories && payload.categories.length > 0) {
      const ids = Array.from(new Set(payload.categories.map((c) => c.id)))
      const valid = await Category.query().where('clientId', clientId).whereIn('id', ids)
      if (valid.length !== ids.length) {
        throw new Error('One or more categories do not belong to this client')
      }
    }

    const post = await Post.create({
      ...payload,
      slug,
      clientId,
      userId: user.id,
    })

    if (payload.categories && payload.categories.length > 0) {
      await post.related('categories').sync(payload.categories.map((c) => c.id))
      await post.load('categories')
    }

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

    // Validar categorías por clientId
    if (payload.categories && payload.categories.length > 0) {
      const ids = Array.from(new Set(payload.categories.map((c) => c.id)))
      const valid = await Category.query().where('clientId', clientId).whereIn('id', ids)
      if (valid.length !== ids.length) {
        throw new Error('One or more categories do not belong to this client')
      }
    }
    await post.related('categories').sync(payload.categories?.map((c) => c.id) ?? [])
    post.merge({
      ...payload,
    })
    await post.save()
    await post.load('categories')
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
