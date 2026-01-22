import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTransactions extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))

      table.string('beneficiary_id').notNullable()
      table.string('shop_id').notNullable()
      table.integer('quantity').notNullable()
      table.string('period').notNullable()
      table.string('last_hash').notNullable()
      table.string('current_hash').notNullable().unique()
      table.string('sync_batch_id').nullable()
      table.boolean('is_synced').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
