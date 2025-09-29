import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Post from '#models/post'
import Attachment from '#models/attachment'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  // @required()
  declare id: string

  @column()
  declare siteId: string

  @column()
  declare authId: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare avatar: string | null

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Attachment)
  declare attachments: HasMany<typeof Attachment>
}
