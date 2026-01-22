import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id!: string
  @column()
  public beneficiaryId!: string
  @column()
  public shopId!: string
  @column()
  public quantity!: number
  @column()
  public period!: string

  @column.dateTime()
  public transactionTime!: DateTime

  @column()
  public previousHash!: string

  @column()
  public currentHash!: string

  @column()
  public deviceId!: string
  @column()
  public isSynced!: boolean

  @column.dateTime()
  public syncedAt!: DateTime | null
  @column()
  public syncBatchId!: string | null
}
