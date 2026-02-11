
export type ViewMode = 'USER' | 'ADMIN' | 'AUTH';
export type TabType = 'dashboard' | 'missions' | 'wallet' | 'profile';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum LedgerType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}

export enum LedgerStatus {
    PENDING = 'PENDING',
    AVAILABLE = 'AVAILABLE',
    COMPLETED = 'COMPLETED',
    REVERSED = 'REVERSED',
    FAILED = 'FAILED'
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    pixKeyEncrypted?: string;
    balance: number;
}
