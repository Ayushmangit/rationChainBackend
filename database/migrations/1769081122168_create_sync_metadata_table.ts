import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSyncMetadata extends BaseSchema {
  protected tableName = 'transactions'

  public async up(): Promise<void> {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('synced_at').nullable()
      table.string('sync_batch_id').nullable()
    })
  }

  public async down(): Promise<void> {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('synced_at')
      table.dropColumn('sync_batch_id')
    })
  }
}
