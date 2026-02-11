
import { PrismaClient, LedgerEntryType, LedgerEntryStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class LedgerService {
  /**
   * Registra uma mudança no ledger com auditoria obrigatória
   */
  static async updateEntryStatus(entryId: string, newStatus: LedgerEntryStatus, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const oldEntry = await tx.ledgerEntry.findUnique({ where: { id: entryId } });

      const updated = await tx.ledgerEntry.update({
        where: { id: entryId },
        data: { status: newStatus }
      });

      // Auditoria (LGPD Compliance)
      await tx.auditLog.create({
        data: {
          userId: updated.userId,
          action: 'LEDGER_STATUS_UPDATE',
          details: JSON.stringify({
            entryId,
            from: oldEntry?.status,
            to: newStatus,
            reason
          })
        }
      });

      return updated;
    });
  }

  static async creditMissionReward(userId: string, amount: number, missionId: string) {
    return await prisma.$transaction(async (tx) => {
      const entry = await tx.ledgerEntry.create({
        data: {
          userId,
          amount,
          type: LedgerEntryType.CREDIT,
          status: LedgerEntryStatus.PENDING,
          description: `Missão concluída: ${missionId}`,
          referenceId: missionId,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'MISSION_CREDIT_CREATED',
          details: JSON.stringify({ amount, missionId })
        }
      });

      return entry;
    });
  }

  static async getAvailableBalance(userId: string): Promise<number> {
    const credits = await prisma.ledgerEntry.aggregate({
      where: { userId, type: LedgerEntryType.CREDIT, status: LedgerEntryStatus.AVAILABLE },
      _sum: { amount: true }
    });

    const debits = await prisma.ledgerEntry.aggregate({
      where: { userId, type: LedgerEntryType.DEBIT, status: { not: LedgerEntryStatus.FAILED } },
      _sum: { amount: true }
    });

    const totalCredits = Number(credits._sum.amount || 0);
    const totalDebits = Number(debits._sum.amount || 0);

    return totalCredits - totalDebits;
  }
}
