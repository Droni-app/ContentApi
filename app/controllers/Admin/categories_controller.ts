import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategoryValidator } from '#validators/Admin/category'
import string from '@adonisjs/core/helpers/string'

export default class AdminCategoriesController {
  /**
   * Display a list of resource
   */
  async index({ clientId, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const q = request.input('q', '')

    const categories = await Category.query()
      .where('clientId', clientId)
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
   * Handle form submission for the create action
   */
  async store({ clientId, request }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.body())

    // Ensure parent category (if provided) belongs to the same client
    if (payload.parentId) {
      await Category.query().where('clientId', clientId).where('id', payload.parentId).firstOrFail()
    }

    const baseSlug = string.slug(payload.name)
    const existsSlug = await Category.query()
      .where('clientId', clientId)
      .where('slug', baseSlug)
      .first()

    const slug = existsSlug ? `${baseSlug}-${Date.now()}` : baseSlug

    const category = await Category.create({
      ...payload,
      slug,
      clientId,
    })

    return category
  }

  /**
   * Show individual record
   */
  async show({ clientId, params }: HttpContext) {
    const category = await Category.query()
      .where('clientId', clientId)
      .where('id', params.id)
      .preload('parent')
      .preload('children')
      .firstOrFail()

    return category
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ clientId, params, request }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.body())

    // Ensure parent category (if provided) belongs to the same client
    if (payload.parentId) {
      await Category.query().where('clientId', clientId).where('id', payload.parentId).firstOrFail()
    }

    const category = await Category.query()
      .where('clientId', clientId)
      .where('id', params.id)
      .firstOrFail()

    category.merge({
      ...payload,
    })

    await category.save()
    return category
  }

  /**
   * Delete record
   */
  async destroy({ clientId, params }: HttpContext) {
    const category = await Category.query()
      .where('clientId', clientId)
      .where('id', params.id)
      .firstOrFail()

    await category.delete()
    return category
  }
}
