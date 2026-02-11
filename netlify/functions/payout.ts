import axios from 'axios';

/**
 * Função Serverless do Netlify para processar saques via PIX na Asaas.
 * Localização: /netlify/functions/payout.ts
 */
export const handler = async (event: any) => {
    // 1. Configurações Iniciais
    // A ASAAS_API_KEY deve ser configurada no painel do Netlify (Environment Variables)
    const ASAAS_KEY = process.env.ASAAS_API_KEY;
    const ASAAS_URL = 'https://api.asaas.com/v3/transfers';

    // 2. Filtro de Segurança: Apenas aceita requisições POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
        };
    }

    try {
        // 3. Extração dos dados enviados pelo formulário (index.tsx)
        const body = JSON.parse(event.body);
        const { amount, pixKey, pixKeyType, description } = body;

        // 4. Validação Básica de Segurança
        if (!amount || amount <= 0 || !pixKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Dados de saque inválidos ou incompletos.' })
            };
        }

        // 5. Requisição para a API da Asaas
        // Documentação Asaas: https://docs.asaas.com/reference/transferir-valores-via-pix
        const response = await axios.post(
            ASAAS_URL,
            {
                value: amount,
                pixAddressKey: pixKey,
                pixAddressKeyType: pixKeyType || 'EVP', // EVP = Chave Aleatória
                description: description || 'Saque Plataforma TarefaPro',
                operationType: 'PIX'
            },
            {
                headers: {
                    'access_token': ASAAS_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        // 6. Resposta de Sucesso para o Frontend
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: 'Saque autorizado e enviado para processamento PIX!',
                asaasId: response.data.id
            })
        };

    } catch (error: any) {
        // 7. Tratamento de Erros Bancários
        console.error('ERRO ASAAS:', error.response?.data || error.message);

        const errorMessage = error.response?.data?.errors?.[0]?.description || 'Erro interno no processamento bancário.';

        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: 'Falha ao processar PIX na Asaas.',
                details: errorMessage
            })
        };
    }
};