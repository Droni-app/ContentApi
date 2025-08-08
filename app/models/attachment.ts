import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Site from '#models/site'
import User from '#models/user'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare siteId: string

  @column()
  declare userId: string

  @column()
  declare name: string

  @column()
  declare path: string

  @column()
  declare size: number

  @column()
  declare mime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static assignUuid(attachment: Attachment) {
    attachment.id = randomUUID()
  }

  // Relaciones
  @belongsTo(() => Site)
  declare site: BelongsTo<typeof Site>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
