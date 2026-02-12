import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API para Saques PIX via Asaas
app.post('/api/payout', async (req, res) => {
    const ASAAS_KEY = process.env.ASAAS_API_KEY;
    if (!ASAAS_KEY) {
        return res.status(500).json({ error: 'Configuração ASAAS_API_KEY ausente no servidor.' });
    }

    try {
        const { amount, pixKey, pixKeyType, description } = req.body;

        console.log(`[API] Solicitando saque de R$ ${amount} para chave ${pixKey}`);

        const response = await axios.post(
            'https://api.asaas.com/v3/transfers',
            {
                value: amount,
                pixAddressKey: pixKey,
                pixAddressKeyType: pixKeyType || 'EVP',
                description: description || 'Saque TarefaPro',
                operationType: 'PIX'
            },
            {
                headers: {
                    'access_token': ASAAS_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ success: true, asaasId: response.data.id });
    } catch (error) {
        const msg = error.response?.data?.errors?.[0]?.description || error.message;
        console.error('[API] Erro Asaas:', msg);
        res.status(500).json({ error: 'Erro bancário', details: msg });
    }
});

// Caminho da pasta de build do Vite
const distPath = path.join(__dirname, 'dist');

// Servir arquivos estáticos
app.use(express.static(distPath));

// Fallback para SPA (Single Page Application)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Build do frontend não encontrado. Por favor, execute: npm run build');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=========================================`);
    console.log(`🚀 TAREFAPRO RODANDO NA PORTA: ${PORT}`);
    console.log(`📂 SERVINDO FRONTEND EM: ${distPath}`);
    console.log(`=========================================\n`);
});