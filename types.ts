// Fix: Defining LedgerStatus and LedgerType enums to resolve "not a module" error in services/ledger.service.ts
export enum LedgerStatus {
    PENDING = 'PENDING',
    AVAILABLE = 'AVAILABLE',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum LedgerType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}
