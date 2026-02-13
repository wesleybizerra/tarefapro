
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

// Produção Mercado Pago
const MP_ACCESS_TOKEN = "APP_USR-5486188186277562-123109-0c5bb1142056dd529240d38a493ce08d-650681524";

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
            name: "Wesley",
            email: "wesleybizerra01@outlook.com",
            password: "Cadernorox@27",
            role: "USER",
            points: 0, // Resetado
            balance: 0.0, // Resetado
            plan: 'FREE',
            completedMissions: [],
            pixKey: '',
            pixType: 'CPF'
        }
    ],
    stats: { totalRevenue: 0.00, adminCommission: 0.00, activeUsers: 2, withdrawals: [] }
};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    res.json({ success: true, user });
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já cadastrado.' });
    const newUser = {
        name, email, password, role: 'USER', points: 0, balance: 0.00, plan: 'FREE',
        completedMissions: [], pixKey: '', pixType: 'CPF'
    };
    db.users.push(newUser);
    db.stats.activeUsers++;
    res.json({ success: true, user: newUser });
});

app.get('/api/sync', (req, res) => {
    const { email } = req.query;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ user, stats: db.stats });
});

app.post('/api/complete-mission', (req, res) => {
    const { email, missionId } = req.body;
    const rawPoints = Number(req.body.points);

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (isNaN(rawPoints) || rawPoints <= 0) {
        return res.status(400).json({ error: 'Erro no processamento de pontos.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (!user.completedMissions) user.completedMissions = [];

    const alreadyDone = user.completedMissions.some(m => m.id === missionId && m.date === today);
    if (alreadyDone) return res.status(400).json({ error: 'Missão já concluída hoje.' });

    let multiplier = 1.0;
    if (user.plan === 'START') multiplier = 1.05;
    if (user.plan === 'PRO') multiplier = 1.15;
    if (user.plan === 'ELITE') multiplier = 1.30;

    const earnedPoints = Math.floor(rawPoints * multiplier);
    user.points = (user.points || 0) + earnedPoints;
    user.completedMissions.push({ id: missionId, date: today });

    db.stats.adminCommission += (earnedPoints / 1000) * 1.5;

    res.json({ success: true, user, earnedPoints });
});

app.post('/api/convert-points', (req, res) => {
    const { email } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user || (user.points || 0) < 1000) return res.status(400).json({ error: 'Mínimo 1.000 pontos.' });

    const amount = Math.floor(user.points / 1000);
    user.balance = (user.balance || 0) + amount;
    user.points = user.points % 1000;
    res.json({ success: true, user });
});

app.post('/api/withdraw', (req, res) => {
    const { email, pixKey, pixType } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    if ((user.balance || 0) < 1.0) return res.status(400).json({ error: 'Saldo insuficiente.' });

    user.pixKey = pixKey;
    user.pixType = pixType;

    db.stats.withdrawals.push({
        email,
        amount: user.balance,
        pixKey,
        pixType,
        date: new Date(),
        status: 'PENDING'
    });
    user.balance = 0;

    res.json({ success: true, user, message: 'Saque solicitado com sucesso!' });
});

app.post('/api/create-preference', async (req, res) => {
    const { planId, email } = req.body;
    const plans = {
        start: { title: "Start - TarefaPro", price: 5.00 },
        pro: { title: "Pro VIP - TarefaPro", price: 10.00 },
        elite: { title: "Elite Master - TarefaPro", price: 15.00 }
    };
    const selectedPlan = plans[planId];

    try {
        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            {
                items: [{ title: selectedPlan.title, unit_price: selectedPlan.price, quantity: 1, currency_id: "BRL" }],
                back_urls: {
                    success: `${req.headers.origin}/?status=success&plan=${planId}&email=${email}`,
                    failure: `${req.headers.origin}/?status=failure`
                },
                auto_return: "approved"
            },
            { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } }
        );
        res.json({ init_point: response.data.init_point });
    } catch (error) {
        res.status(500).json({ error: "Erro ao gerar pagamento Mercado Pago." });
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Porta: ${PORT}`));
