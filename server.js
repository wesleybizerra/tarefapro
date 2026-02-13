
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO MERCADO PAGO ---
const MP_ACCESS_TOKEN = "APP_USR-5771559898662344-123109-873861a0a8c65207496af0b1d59c3733-3102973971";

// --- BANCO DE DADOS EM MEMÓRIA ---
const db = {
    users: [
        {
            name: "Admin Wesley",
            email: "wesleybizerra@hotmail.com",
            password: "Cadernorox@27",
            role: "ADMIN",
            points: 10000,
            balance: 0.0,
            plan: 'ELITE'
        },
        {
            name: "Wesley Premium",
            email: "wesleybizerra01@outlook.com",
            password: "Cadernorox@27",
            role: "USER",
            points: 5000,
            balance: 15.0,
            plan: 'ELITE'
        }
    ],
    stats: {
        totalRevenue: 0.00,
        adminCommission: 0.00,
        activeUsers: 2
    }
};

// --- ROTAS DE API ---

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    const newUser = { name, email, password, role: 'USER', points: 0, balance: 0.00, plan: 'FREE' };
    db.users.push(newUser);
    db.stats.activeUsers++;
    res.json({ success: true, user: newUser });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    res.json({ success: true, user });
});

app.get('/api/sync', (req, res) => {
    const { email } = req.query;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).send('Not found');
    res.json({ user, stats: db.stats });
});

// Confirmação automática de plano pós-pagamento
app.post('/api/confirm-payment', (req, res) => {
    const { email, planId } = req.body;
    const user = db.users.find(u => u.email === email);

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Mapeamento de IDs para nomes de planos no DB
    const planMap = {
        'start': 'START',
        'pro': 'PRO',
        'elite': 'ELITE'
    };

    if (planMap[planId]) {
        user.plan = planMap[planId];
        console.log(`[Pagamento] Plano ${user.plan} ativado para ${email}`);
        res.json({ success: true, user });
    } else {
        res.status(400).json({ error: 'Plano inválido' });
    }
});

// Missão Concluída (Lógica de Comissão 2x)
app.post('/api/complete-mission', (req, res) => {
    const { email, missionId } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Valores base de pontos por missão (random 100-500)
    const basePoints = Math.floor(Math.random() * (500 - 100 + 1) + 100);

    // Bônus por plano
    let multiplier = 1.0;
    if (user.plan === 'START') multiplier = 1.05;
    if (user.plan === 'PRO') multiplier = 1.15;
    if (user.plan === 'ELITE') multiplier = 1.30;

    const earnedPoints = Math.floor(basePoints * multiplier);
    user.points += earnedPoints;

    // LUCRO DO ADMIN: O Admin ganha o dobro do valor em "dinheiro" equivalente
    const adminCommission = (earnedPoints / 1000) * 2;
    db.stats.adminCommission += adminCommission;

    res.json({ success: true, user, earnedPoints });
});

app.post('/api/convert-points', (req, res) => {
    const { email } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user || user.points < 1000) return res.status(400).json({ error: 'Saldo insuficiente' });

    const amount = user.points / 1000;
    user.balance += amount;
    user.points = 0;

    res.json({ success: true, user });
});

// --- INTEGRAÇÃO MERCADO PAGO ---
app.post('/api/create-preference', async (req, res) => {
    const { planId, email } = req.body;

    const plans = {
        start: { title: "Plano Iniciante TarefaPro", price: 5.00 },
        pro: { title: "Plano Pro VIP TarefaPro", price: 10.00 },
        elite: { title: "Plano Elite Master TarefaPro", price: 15.00 }
    };

    const selectedPlan = plans[planId];

    try {
        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            {
                items: [{
                    title: selectedPlan.title,
                    unit_price: selectedPlan.price,
                    quantity: 1,
                    currency_id: "BRL"
                }],
                back_urls: {
                    success: `${req.headers.origin}/?status=success&plan=${planId}&email=${email}`,
                    failure: `${req.headers.origin}/?status=failure`,
                    pending: `${req.headers.origin}/?status=pending`
                },
                auto_return: "approved"
            },
            {
                headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
            }
        );

        res.json({ init_point: response.data.init_point });
    } catch (error) {
        console.error("MP Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao criar preferência" });
    }
});

// Healthcheck
app.get('/health', (req, res) => res.status(200).send('OK'));

// --- SERVIR FRONTEND ---
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
