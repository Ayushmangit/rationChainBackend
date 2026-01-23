import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('ration_card_id').notNullable()
      table.string('name').nullable()
      table.text('address').notNullable()
      table.string('password').notNullable()
      table.integer('total').notNullable().defaultTo(10)
      table.enum('role', ['distributor', 'user']).defaultTo('user')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
