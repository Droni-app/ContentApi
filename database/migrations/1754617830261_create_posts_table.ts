import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('client_id').notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('slug').notNullable()
      table.unique(['client_id', 'slug'])
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('picture').nullable()
      table.text('content').nullable()
      table.string('format').notNullable().defaultTo('markdown')
      table.boolean('active').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
