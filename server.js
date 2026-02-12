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

// API para Saques PIX
app.post('/api/payout', async (req, res) => {
    const ASAAS_KEY = process.env.ASAAS_API_KEY;
    if (!ASAAS_KEY) {
        return res.status(500).json({ error: 'Configuração ausente', details: 'ASAAS_API_KEY não configurada.' });
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
        res.status(500).json({ error: 'Erro Asaas', details: msg });
    }
});

// Caminho absoluto para a pasta de build do frontend
const distPath = path.join(__dirname, 'dist');

// 1. Servir arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(distPath));

// 2. Fallback para SPA: Qualquer rota que não seja API ou arquivo estático volta pro index.html da 'dist'
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Build do frontend não encontrado. Verifique se o comando "npm run build" foi executado.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor pronto em http://0.0.0.0:${PORT}`);
});