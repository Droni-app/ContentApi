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
import User from '#models/user'
import Category from '#models/category'
import Attr from '#models/attr'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare siteId: string

  @column()
  declare userId: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare picture: string | null

  @column()
  declare content: string | null

  @column()
  declare format: string

  @column()
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(post: Post) {
    post.id = randomUUID()
  }

  // Relaciones
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Category, {
    pivotTable: 'category_posts',
  })
  declare categories: ManyToMany<typeof Category>

  @hasMany(() => Attr)
  declare attrs: HasMany<typeof Attr>
}
