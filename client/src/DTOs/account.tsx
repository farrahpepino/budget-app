export interface AccountDto  {
    id?: string,
    user_id: string
    type: string
    bank: string
    balance: number
    date: Date
    last_digits: number
    is_edited: boolean
}

