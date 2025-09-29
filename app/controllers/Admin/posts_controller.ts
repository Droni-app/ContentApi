import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator } from '#validators/Admin/post'
import string from '@adonisjs/core/helpers/string'
import Category from '#models/category'

export default class AdminPostsController {
  /**
   * @index
   * @tag Admin_Posts
   * @operationId adminGetPosts
   * @summary Returns a list of paginated posts for site
   * @responseBody 200 - <Post[]>.with(user, categories, attrs).paginated(data, meta)
   */
  async index({ siteId, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const q = request.input('q', '')
    const posts = await Post.query()
      .where('siteId', siteId)
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
   * @store
   * @tag Admin_Posts
   * @operationId adminCreatePost
   * @summary Creates a new post
   * @responseBody 201 - <Post>
   */
  async store({ siteId, user, request }: HttpContext) {
    const payload = await createPostValidator.validate(request.body())
    const existsSlug = await Post.query()
      .where('siteId', siteId)
      .where('slug', string.slug(payload.name))
      .first()
    const slug = existsSlug
      ? `${string.slug(payload.name)}-${Date.now()}`
      : string.slug(payload.name)

    // Validar categorías por siteId
    if (payload.categories && payload.categories.length > 0) {
      const ids = Array.from(new Set(payload.categories.map((c) => c.id)))
      const valid = await Category.query().where('siteId', siteId).whereIn('id', ids)
      if (valid.length !== ids.length) {
        throw new Error('One or more categories do not belong to this site')
      }
    }

    const post = await Post.create({
      ...payload,
      slug,
      siteId,
      userId: user.id,
    })

    if (payload.categories && payload.categories.length > 0) {
      await post.related('categories').sync(payload.categories.map((c) => c.id))
      await post.load('categories')
    }

    return post
  }
  /**
   * @show
   * @tag Admin_PostS
   * @operationId adminGetPost
   * @summary Returns a single post by id and it's relations
   * @responseBody 200 - <Post>.with(user, categories, attrs)
   */
  async show({ siteId, params }: HttpContext) {
    const post = await Post.query()
      .where('siteId', siteId)
      .where('id', params.id)
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .firstOrFail()
    return post
  }
  /**
   * @update
   * @tag Admin_Posts
   * @operationId adminUpdatePost
   * @summary Updates a post
   * @responseBody 200 - <Post>.with(categories)
   */
  async update({ siteId, params, request }: HttpContext) {
    const payload = await createPostValidator.validate(request.body())
    const post = await Post.query().where('siteId', siteId).where('id', params.id).firstOrFail()

    // Validar categorías por siteId
    if (payload.categories && payload.categories.length > 0) {
      const ids = Array.from(new Set(payload.categories.map((c) => c.id)))
      const valid = await Category.query().where('siteId', siteId).whereIn('id', ids)
      if (valid.length !== ids.length) {
        throw new Error('One or more categories do not belong to this site')
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
   * @destroy
   * @tag Admin_PostS
   * @operationId adminDeletePost
   * @summary Deletes a post
   * @responseBody 200 - <Post>
   */
  async destroy({ siteId, params }: HttpContext) {
    const post = await Post.query().where('siteId', siteId).where('id', params.id).firstOrFail()
    await post.delete()
    return post
  }
}
