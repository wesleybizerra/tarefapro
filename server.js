
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/** 
 * CREDENCIAIS DE PRODUÇÃO MERCADO PAGO
 * Fornecidas pelo usuário: wesleybizerra01
 */
const MP_ACCESS_TOKEN = "APP_USR-5486188186277562-123109-0c5bb1142056dd529240d38a493ce08d-650681524";
const MP_PUBLIC_KEY = "APP_USR-54514598-de68-42a2-baa9-00129449da87";

const db = {
    users: [
        {
            name: "Admin Wesley",
            email: "wesleybizerra@hotmail.com",
            password: "Cadernorox@27",
            role: "ADMIN",
            points: 10000,
            balance: 0.0,
            plan: 'ELITE',
            completedMissions: []
        },
        {
            name: "Wesley Premium",
            email: "wesleybizerra01@outlook.com",
            password: "Cadernorox@27",
            role: "USER",
            points: 0, // CONTA ZERADA CONFORME SOLICITADO
            balance: 0.0,
            plan: 'FREE',
            completedMissions: []
        }
    ],
    stats: { totalRevenue: 0.00, adminCommission: 0.00, activeUsers: 2, withdrawals: [] }
};

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já cadastrado.' });
    const newUser = {
        name, email, password, role: 'USER', points: 0, balance: 0.00, plan: 'FREE',
        completedMissions: []
    };
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

app.post('/api/confirm-payment', (req, res) => {
    const { email, planId } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const planMap = { 'start': 'START', 'pro': 'PRO', 'elite': 'ELITE' };
    if (planMap[planId]) {
        user.plan = planMap[planId];
        res.json({ success: true, user });
    } else {
        res.status(400).json({ error: 'Plano inválido' });
    }
});

// Lógica de Missão: PONTOS FIXOS E TRAVA 1X POR DIA
app.post('/api/complete-mission', (req, res) => {
    const { email, missionId, points } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Pega data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Verifica se a missão já consta como concluída para HOJE
    const alreadyDone = user.completedMissions.some(m => m.id === missionId && m.date === today);
    if (alreadyDone) {
        return res.status(400).json({ error: 'Você já completou esta missão hoje. Tente amanhã!' });
    }

    // Multiplicador baseado no plano VIP
    let multiplier = 1.0;
    if (user.plan === 'START') multiplier = 1.05;
    if (user.plan === 'PRO') multiplier = 1.15;
    if (user.plan === 'ELITE') multiplier = 1.30;

    // Usa EXATAMENTE o valor de pontos enviado (que vem da definição da missão no frontend)
    const earnedPoints = Math.floor(points * multiplier);
    user.points += earnedPoints;

    // Salva no histórico para impedir repetição no mesmo dia
    user.completedMissions.push({ id: missionId, date: today });

    // Comissão administrativa (Simulação)
    const adminCommission = (earnedPoints / 1000) * 1.5;
    db.stats.adminCommission += adminCommission;

    res.json({ success: true, user, earnedPoints });
});

app.post('/api/convert-points', (req, res) => {
    const { email } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user || user.points < 1000) return res.status(400).json({ error: 'Saldo insuficiente para conversão' });
    const amount = user.points / 1000;
    user.balance += amount;
    user.points = 0;
    res.json({ success: true, user });
});

app.post('/api/withdraw', (req, res) => {
    const { email, pixKey, pixType } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    if (user.balance < 1.0) return res.status(400).json({ error: 'Saldo insuficiente para saque.' });

    const withdrawal = {
        email,
        amount: user.balance,
        pixKey,
        pixType,
        date: new Date(),
        status: 'PENDING'
    };

    db.stats.withdrawals.push(withdrawal);
    user.balance = 0;

    res.json({ success: true, user, message: 'Solicitação de saque enviada!' });
});

app.post('/api/create-preference', async (req, res) => {
    const { planId, email } = req.body;
    const plans = {
        start: { title: "Plano Iniciante - TarefaPro", price: 5.00 },
        pro: { title: "Plano Pro VIP - TarefaPro", price: 10.00 },
        elite: { title: "Plano Elite Master - TarefaPro", price: 15.00 }
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
                payment_methods: {
                    installments: 1,
                    // Garante que PIX esteja disponível (configurável também no painel MP)
                    excluded_payment_types: []
                },
                back_urls: {
                    success: `${req.headers.origin}/?status=success&plan=${planId}&email=${email}`,
                    failure: `${req.headers.origin}/?status=failure`,
                    pending: `${req.headers.origin}/?status=pending`
                },
                auto_return: "approved"
            },
            { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } }
        );
        res.json({ init_point: response.data.init_point });
    } catch (error) {
        console.error("MP API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao conectar com o Mercado Pago de produção." });
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Produção TarefaPro ativa na porta ${PORT}`);
});
