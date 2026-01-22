import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTransactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('beneficiary_id').notNullable()
      table.string('shop_id').notNullable()
      table.integer('quantity').notNullable()
      table.string('period').notNullable()
      table.timestamp('transaction_time').notNullable()
      table.string('previous_hash').notNullable()
      table.string('current_hash').notNullable().unique()
      table.string('device_id').notNullable()
      table.boolean('is_synced').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(`
      CREATE UNIQUE INDEX beneficiary_period_idx
      ON transactions (beneficiary_id, period)
    `)
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
