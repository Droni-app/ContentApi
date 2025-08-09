import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import Env from '#start/env'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

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

  @computed()
  get url() {
    return `${Env.get('SPACES_URL')}/${this.path}`
  }

  @beforeCreate()
  static assignUuid(attachment: Attachment) {
    attachment.id = randomUUID()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
