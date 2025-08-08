import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Site from '#models/site'
import Post from '#models/post'
import Attachment from '#models/attachment'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare siteId: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare provider: string | null

  @column()
  declare providerId: string | null

  @column()
  declare avatar: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  // Relaciones
  @belongsTo(() => Site)
  declare site: BelongsTo<typeof Site>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Attachment)
  declare attachments: HasMany<typeof Attachment>
}
