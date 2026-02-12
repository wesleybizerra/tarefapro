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

// --- MOCK API ---
const globalState = {
    users: [{ name: "Wesley Bizerra", email: "wesleybizerra@hotmail.com", password: "Cadernorox@27", role: "ADMIN", balance: 0 }],
    stats: { totalRevenue: 0, adminCommission: 0, activeUsers: 1 }
};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = globalState.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    res.json({ success: true, user });
});

app.get('/api/admin/stats', (req, res) => res.json({ ...globalState.stats, members: globalState.users }));

// --- SERVIR FRONTEND ---
const distPath = path.resolve(__dirname, 'dist');

// Middleware para arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(distPath));

// Fallback para qualquer outra rota (SPA) - Envia o index.html gerado pelo build
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Build do frontend não encontrado. Verifique se "npm run build" foi executado.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});