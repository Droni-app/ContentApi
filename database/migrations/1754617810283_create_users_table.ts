import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('auth_id').notNullable()
      table.string('site_id').notNullable()
      table.unique(['auth_id', 'site_id'])
      table.string('name').notNullable()
      table.string('email', 254).notNullable()
      table.string('avatar').nullable()
      table.string('role').notNullable().defaultTo('user')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
