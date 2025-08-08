import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Post from '#models/post'

export default class Attr extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare postId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare value: string

  @beforeCreate()
  static assignUuid(attr: Attr) {
    attr.id = randomUUID()
  }

  // Relaciones
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
