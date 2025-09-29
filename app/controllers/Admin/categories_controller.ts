import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategoryValidator } from '#validators/Admin/category'
import string from '@adonisjs/core/helpers/string'

export default class AdminCategoriesController {
  /**
   * @index
   * @tag Admin_Categories
   * @operationId adminGetCategories
   * @summary Returns list of paginated categories for site
   * @responseBody 200 - <Category[]>.with(parent, children).paginated(data, meta)
   */
  async index({ siteId, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const q = request.input('q', '')

    const categories = await Category.query()
      .where('siteId', siteId)
      .preload('parent')
      .preload('children')
      .if(q, (query) => {
        query.where('name', 'LIKE', `%${q}%`).orWhere('description', 'LIKE', `%${q}%`)
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return categories
  }
  /**
   * @store
   * @tag Admin_Categories
   * @operationId adminCreateCategory
   * @summary Creates a new category
   * @responseBody 201 - <Category>
   */
  async store({ siteId, request }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.body())

    // Ensure parent category (if provided) belongs to the same site
    if (payload.parentId) {
      await Category.query().where('siteId', siteId).where('id', payload.parentId).firstOrFail()
    }

    const baseSlug = string.slug(payload.name)
    const existsSlug = await Category.query()
      .where('siteId', siteId)
      .where('slug', baseSlug)
      .first()

    const slug = existsSlug ? `${baseSlug}-${Date.now()}` : baseSlug

    const category = await Category.create({
      ...payload,
      slug,
      siteId,
    })

    return category
  }
  /**
   * @show
   * @tag Admin_Categories
   * @operationId adminGetCategory
   * @summary Returns a single category by id and it's relations
   * @responseBody 200 - <Category>.with(parent, children)
   */
  async show({ siteId, params }: HttpContext) {
    const category = await Category.query()
      .where('siteId', siteId)
      .where('id', params.id)
      .preload('parent')
      .preload('children')
      .firstOrFail()

    return category
  }
  /**
   * @update
   * @tag Admin_Categories
   * @operationId adminUpdateCategory
   * @summary Updates a category by id
   * @responseBody 200 - <Category>
   */
  async update({ siteId, params, request }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.body())

    // Ensure parent category (if provided) belongs to the same site
    if (payload.parentId) {
      await Category.query().where('siteId', siteId).where('id', payload.parentId).firstOrFail()
    }

    const category = await Category.query()
      .where('siteId', siteId)
      .where('id', params.id)
      .firstOrFail()

    category.merge({
      ...payload,
    })

    await category.save()
    return category
  }
  /**
   * @destroy
   * @tag Admin_Categories
   * @operationId adminDeleteCategory
   * @summary Deletes a category by id
   * @responseBody 200 - <Category>
   */
  async destroy({ siteId, params }: HttpContext) {
    const category = await Category.query()
      .where('siteId', siteId)
      .where('id', params.id)
      .firstOrFail()

    await category.delete()
    return category
  }
}
