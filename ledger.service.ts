
import { LedgerStatus, LedgerType } from '../types.ts';

// Mock data storage for demonstration as Prisma is server-side
const ledgerMock: any[] = [];

export class LedgerService {
  /**
   * Registra uma mudança no ledger com auditoria obrigatória
   */
  static async updateEntryStatus(entryId: string, newStatus: LedgerStatus, reason: string) {
      console.log(`Updating ledger ${entryId} to status ${newStatus} due to: ${reason}`);
      // Implementation logic would go here
      return { id: entryId, status: newStatus };
  }

  static async creditMissionReward(userId: string, amount: number, missionId: string) {
      const entry = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          amount,
          type: LedgerType.CREDIT,
          status: LedgerStatus.PENDING,
          description: `Missão concluída: ${missionId}`,
          createdAt: new Date(),
      };
      ledgerMock.push(entry);
      console.log('Ledger entry created:', entry);
      return entry;
  }

  static async getAvailableBalance(userId: string): Promise<number> {
    const totalCredits = ledgerMock
        .filter(e => e.userId === userId && e.type === LedgerType.CREDIT && e.status === LedgerStatus.AVAILABLE)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalDebits = ledgerMock
        .filter(e => e.userId === userId && e.type === LedgerType.DEBIT && e.status !== LedgerStatus.FAILED)
        .reduce((acc, curr) => acc + curr.amount, 0);

    return totalCredits - totalDebits;
  }
}
