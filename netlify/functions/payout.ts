import axios from 'axios';

/**
 * Função Serverless para Processamento de Saques (PIX)
 * Esta função roda no servidor do Netlify, protegendo sua Chave API.
 */
export const handler = async (event: any) => {
    // 1. Pega a chave da Asaas das variáveis de ambiente do Netlify
    const ASAAS_KEY = process.env.ASAAS_API_KEY;

    // URL da Asaas (Sandbox para testes ou Produção)
    // Se você estiver em produção, use: https://api.asaas.com/v3/transfers
    const ASAAS_URL = 'https://api.asaas.com/v3/transfers';

    // 2. Segurança: Só permite requisições do tipo POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
        };
    }

    try {
        // 3. Lê os dados enviados pelo seu site (index.tsx)
        const body = JSON.parse(event.body);
        const { amount, pixKey, pixKeyType, description } = body;

        // 4. Validação rápida dos dados
        if (!amount || !pixKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Valor e Chave PIX são obrigatórios.' })
            };
        }

        // 5. Chamada oficial para a API da Asaas
        const response = await axios.post(
            ASAAS_URL,
            {
                value: amount,               // Valor do saque
                pixAddressKey: pixKey,       // Chave PIX destino
                pixAddressKeyType: pixKeyType || 'EVP', // Tipo da chave (EVP = Aleatória)
                description: description || 'Saque Plataforma TarefaPro',
                operationType: 'PIX'         // Define que a transferência é via PIX
            },
            {
                headers: {
                    'access_token': ASAAS_KEY, // Sua chave secreta (nunca aparece no navegador)
                    'Content-Type': 'application/json'
                }
            }
        );

        // 6. Retorna sucesso para o site
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: 'PIX enviado com sucesso!',
                asaasId: response.data.id
            })
        };

    } catch (error: any) {
        // 7. Tratamento de erros (ex: saldo insuficiente na Asaas ou chave inválida)
        console.error('Erro no Payout:', error.response?.data || error.message);

        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: 'Falha no processamento do PIX.',
                details: error.response?.data?.errors?.[0]?.description || 'Erro desconhecido na Asaas'
            })
        };
    }
};