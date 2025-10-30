import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

export default class PostsController {
  /**
   * @index
   * @tag Posts
   * @operationId getPosts
   * @summary Returns array of posts and it's relations
   * @responseBody 200 - <Post[]>.with(user, categories, attrs).paginated(data, meta)
   */
  async index({ siteId, request }: HttpContext) {
    const { page, perPage, q, category } = request.qs()
    const posts = await Post.query()
      .where('siteId', siteId)
      .where('active', true)
      .if(q, (query) => {
        query.andWhere((subQuery) => {
          subQuery
            .where('name', 'like', `%${q}%`)
            .orWhere('description', 'like', `%${q}%`)
            .orWhere('content', 'like', `%${q}%`)
        })
      })
      .if(category, (query) => {
        query.whereHas('categories', (categoryQuery) => {
          categoryQuery.where('slug', category)
        })
      })
      .preload('user')
      .preload('categories')
      .preload('attrs')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
    return posts
  }

  /**
   * @show
   * @tag Posts
   * @operationId getPost
   * @summary Returns a single post by slug and it's relations
   * @responseBody 200 - <Post>.with(user, categories, attrs)
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
