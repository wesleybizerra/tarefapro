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
        console.error('[SERVER] ASAAS_API_KEY não configurada.');
        return res.status(500).json({ error: 'Configuração bancária ausente no servidor.' });
    }

    try {
        const { amount, pixKey, pixKeyType, description } = req.body;

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
        console.error('[API ERROR]:', msg);
        res.status(500).json({ error: 'Erro no processamento PIX', details: msg });
    }
});

const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend não encontrado. Execute npm run build.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor pronto na porta ${PORT}`);
});