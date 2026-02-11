
import { decrypt } from './crypto.utils.ts';

// Mocking axios behavior as it's not pre-installed in this environment
const api = {
<<<<<<< HEAD
    post: async (url: string, data: any) => {
        console.log(`API POST to ${url}`, data);
        return { data: { success: true, id: 'asaas_transfer_id_123' } };
    }
=======
  post: async (url: string, data: any) => {
    console.log(`API POST to ${url}`, data);
    return { data: { success: true, id: 'asaas_transfer_id_123' } };
  }
>>>>>>> 78732ff (fix: ajuste de build e deploy para Railway)
};

export class AsaasService {
  /**
   * Realiza uma transferência PIX (Payout) - Descriptografa apenas aqui
   */
  static async createPixTransfer(params: {
    value: number,
    encryptedPixKey: string,
    pixKeyType: any,
    description: string,
    externalReference: string
  }) {
    // DESCRIPTOGRAFIA EM MEMÓRIA (LGPD Compliance)
    const clearPixKey = await decrypt(params.encryptedPixKey);

    try {
      const response = await api.post('/transfers', {
        value: params.value,
        pixAddressKey: clearPixKey,
        pixAddressKeyType: params.pixKeyType,
        description: params.description,
        externalReference: params.externalReference,
        operationType: 'PIX'
      });

      return response.data;
    } catch (error: any) {
      console.error('Asaas Error:', error.message);
      throw new Error('Erro na comunicação com o banco central.');
    }
  }
}
