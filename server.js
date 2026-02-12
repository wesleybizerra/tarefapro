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

// --- BANCO DE DADOS EM MEMÓRIA ---
// Nota: Em produção no Railway, esses dados resetam se o app reiniciar.
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

// Registro
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (globalState.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    const newUser = { name, email, password, role: "USER", balance: 0, totalPaid: 0, pixKey: "" };
    globalState.users.push(newUser);
    globalState.stats.activeUsers = globalState.users.length;
    const { password: _, ...userWithoutPass } = newUser;
    res.json({ success: true, user: userWithoutPass });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = globalState.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, user: userWithoutPass });
});

// Admin Stats (Agora com lista de usuários)
app.get('/api/admin/stats', (req, res) => {
    res.json({
        ...globalState.stats,
        members: globalState.users.map(u => ({ name: u.name, email: u.email, balance: u.balance, role: u.role }))
    });
});

app.post('/api/user/task', (req, res) => {
    const { email, value } = req.body;
    const user = globalState.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const commission = value * 0.10;
    user.balance += (value - commission);
    globalState.stats.totalRevenue += value;
    globalState.stats.adminCommission += commission;
    res.json({ success: true, newBalance: user.balance });
});

app.post('/api/payout', async (req, res) => {
    const ASAAS_KEY = process.env.ASAAS_API_KEY;
    if (!ASAAS_KEY) return res.status(500).json({ error: 'ASAAS_API_KEY não configurada.' });
    try {
        const { amount, pixKey, userEmail } = req.body;
        await axios.post('https://api.asaas.com/v3/transfers', {
            value: amount, pixAddressKey: pixKey, operationType: 'PIX'
        }, { headers: { 'access_token': ASAAS_KEY } });

        if (userEmail) {
            const user = globalState.users.find(u => u.email === userEmail);
            if (user) { user.totalPaid += user.balance; user.balance = 0; }
        } else {
            globalState.stats.adminCommission = 0;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Port: ${PORT}`));