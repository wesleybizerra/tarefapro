import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de Healthcheck para o Railway
app.get('/health', (req, res) => res.status(200).send('OK'));

// --- ESTADO GLOBAL (MOCK) ---
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

// API Endpoints
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (globalState.users.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já cadastrado.' });
    const newUser = { name, email, password, role: "USER", balance: 0, totalPaid: 0, pixKey: "" };
    globalState.users.push(newUser);
    globalState.stats.activeUsers = globalState.users.length;
    res.json({ success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role, balance: 0 } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = globalState.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, balance: user.balance } });
});

app.get('/api/admin/stats', (req, res) => {
    res.json({ ...globalState.stats, members: globalState.users.map(u => ({ name: u.name, email: u.email, balance: u.balance, role: u.role })) });
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

const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
    console.log(`✅ Servindo arquivos de: ${distPath}`);
    app.use(express.static(distPath));
}

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Aguarde, a aplicação ainda está em build ou o arquivo index.html não foi gerado.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor pronto na porta ${PORT}`);
});