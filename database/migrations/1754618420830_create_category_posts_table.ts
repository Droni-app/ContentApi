import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .uuid('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.uuid('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.unique(['category_id', 'post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
