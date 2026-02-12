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

// --- BANCO DE DADOS EM MEMÓRIA (Persistência enquanto o servidor estiver rodando) ---
const globalState = {
    users: [
        { name: "Wesley Bizerra", email: "wesleybizerra@hotmail.com", password: "Cadernorox@27", role: "ADMIN", balance: 0, totalPaid: 0, pixKey: "71981574664" }
    ],
    stats: {
        totalRevenue: 0.00,
        adminCommission: 0.00,
        activeUsers: 1,
        pendingWithdrawals: 0
    }
};

// --- ENDPOINTS DE AUTENTICAÇÃO E SINCRONIZAÇÃO ---

// Registro de novos usuários
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (globalState.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const newUser = {
        name,
        email,
        password,
        role: "USER",
        balance: 0,
        totalPaid: 0,
        pixKey: ""
    };

    globalState.users.push(newUser);
    globalState.stats.activeUsers = globalState.users.length;

    const { password: _, ...userWithoutPass } = newUser;
    res.json({ success: true, user: userWithoutPass });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = globalState.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, user: userWithoutPass });
});

// Buscar Estatísticas (Admin)
app.get('/api/admin/stats', (req, res) => {
    res.json(globalState.stats);
});

// Atualizar saldo/tarefa (Simulação de ganho)
app.post('/api/user/task', (req, res) => {
    const { email, value } = req.body;
    const user = globalState.users.find(u => u.email === email);

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const commission = value * 0.10;
    const userGain = value - commission;

    user.balance += userGain;
    globalState.stats.totalRevenue += value;
    globalState.stats.adminCommission += commission;

    res.json({ success: true, newBalance: user.balance });
});

// API para Saques PIX
app.post('/api/payout', async (req, res) => {
    const ASAAS_KEY = process.env.ASAAS_API_KEY;
    if (!ASAAS_KEY) {
        return res.status(500).json({ error: 'Configuração ausente', details: 'ASAAS_API_KEY não configurada.' });
    }

    try {
        const { amount, pixKey, pixKeyType, description, userEmail } = req.body;

        // Processamento do Saque na Asaas
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

        // Atualizar saldos internos após sucesso
        if (userEmail) {
            const user = globalState.users.find(u => u.email === userEmail);
            if (user) {
                user.totalPaid += user.balance;
                user.balance = 0;
            }
        } else {
            // Se for saque de comissão do admin
            globalState.stats.adminCommission = 0;
        }

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

// 2. Fallback para SPA
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Build do frontend não encontrado.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor pronto em http://0.0.0.0:${PORT}`);
});