import { BaseModel, column } from '@adonisjs/lucid/orm'
export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare beneficiaryId: string
  @column()
  declare shopId: string
  @column()
  declare quantity: number
  @column()
  declare period: string
  @column()
  declare previousHash: string

  @column()
  declare currentHash: string

  @column()
  declare isSynced: boolean
  @column()
  declare syncBatchId: string | null

}
