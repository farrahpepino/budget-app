import type { AccountDto } from "./account"
export interface TransactionDto {
    id?: string 
    user_id: string
    type: string
    acc_1: AccountDto
    acc_2: AccountDto
    category: string
    amount: number
    date: Date
    note: string
    is_edited: boolean
    acc_1_r: AccountDto
    acc_2_r: AccountDto
    is_source: boolean
    pair_id?: string
}