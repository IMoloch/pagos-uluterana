export interface Month {
    id: string
    charges: Charge[]
    dueDate: string
    paid: boolean
    paidDate?: string
    card?: string
    totalFee?: number
}

export interface Charge {
    description: string
    fee: number
}