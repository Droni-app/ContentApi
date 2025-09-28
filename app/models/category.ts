import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  manyToMany,
  beforeCreate,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Post from '#models/post'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare siteId: string

  @column()
  declare parentId: string | null

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare picture: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(category: Category) {
    category.id = randomUUID()
  }

  @belongsTo(() => Category, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Category>

  @hasMany(() => Category, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof Category>

  @manyToMany(() => Post, {
    pivotTable: 'category_posts',
  })
  declare posts: ManyToMany<typeof Post>
}
