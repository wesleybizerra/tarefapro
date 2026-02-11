
import axios from 'axios';
import { decrypt } from './crypto.utils';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/v3';

const api = axios.create({
  baseURL: ASAAS_URL,
  headers: { access_token: ASAAS_API_KEY }
});

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
    const clearPixKey = decrypt(params.encryptedPixKey);

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
      console.error('Asaas Error:', error.response?.data || error.message);
      throw new Error('Erro na comunicação com o banco central.');
    }
  }
}
