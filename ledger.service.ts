export enum LedgerEntryStatus {
  PENDING = 'PENDING',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class LedgerService {
  static async creditMissionReward(userId: string, amount: number, missionId: string) {
    console.log(`[Ledger] Crédito de R$ ${amount} registrado.`);
    return {
      id: Math.random().toString(36).substr(2, 9),
      status: LedgerEntryStatus.PENDING,
      amount
    };
  }

  static async getAvailableBalance(userId: string): Promise<number> {
    return 42.50;
  }
}
