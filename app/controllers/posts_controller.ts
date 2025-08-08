import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ clientId }: HttpContext) {
    const posts = await Post.query()
      .where('clientId', clientId)
      .where('active', true)
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .orderBy('createdAt', 'desc')
      .paginate(1, 10)
    return posts
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const postSlug = params.id
    const post = await Post.query()
      .where('slug', postSlug)
      .where('active', true)
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .firstOrFail()

    return post
  }
}
