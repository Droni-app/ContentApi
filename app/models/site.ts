import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import Category from '#models/category'
import Post from '#models/post'
import Attachment from '#models/attachment'

export default class Site extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare domain: string

  @column()
  declare clients: string | null

  @beforeCreate()
  static assignUuid(site: Site) {
    site.id = randomUUID()
  }

  // Relaciones
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Attachment)
  declare attachments: HasMany<typeof Attachment>
}
